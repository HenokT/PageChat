import { loadSummarizationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { useEffect, useMemo, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useStoredState } from "../utils/useStoredState";
import { StorageKeys } from "../utils/constants";
import { useSettingsStore } from "../utils/useSettingsStore";
import { getCurrentPageContent } from "../utils/getPageContent";
import { Loader } from "../common/loader/Loader";
import { SelectProps, Select } from "../common/select/Select";

type SummaryType = {
  type: "concise" | "detailed" | "table-of-content";
  label: string;
  template: string; //| ((input: Record<string, string>) => string);
};

const SUPPORTED_SUMMARY_TYPES: SummaryType[] = [
  {
    type: "concise",
    label: "Concise",
    template: `Write a concise summary of the following in markdown format:


"{text}"


CONCISE SUMMARY:`,
  },
  {
    type: "detailed",
    label: "Detailed",
    template: `Write a detailed summary of the following in markdown format:


"{text}"


DETAILED SUMMARY:`,
  },
  {
    type: "table-of-content",
    label: "Table of Content",
    template: `Generate a table of content of the following in markdown format. If the table of contents already exists, use it:


"{text}"


TABLE OF CONTENT:`,
  },
];

type StoredSummary = {
  type: SummaryType["type"];
  content: string;
};

const INITIAL_SUMMARY = {
  type: SUPPORTED_SUMMARY_TYPES[0].type,
  content: "",
};

export default function PageSummary() {
  const {
    settings: { openAIApiKey },
  } = useSettingsStore();
  const [generating, setGenerating] = useState(false);
  const [loading, summary, setSummary] = useStoredState<StoredSummary>({
    storageKey: StorageKeys.PAGE_SUMMARY,
    defaultValue: INITIAL_SUMMARY,
    storageArea: "session",
    scope: "page",
  });

  const summaryTypeOptions = useMemo<SelectProps["options"]>(
    () =>
      SUPPORTED_SUMMARY_TYPES.map((type) => ({
        label: type.label,
        value: type.type,
      })),
    []
  );

  useEffect(() => {
    let ignore = false;

    async function summarizeCurrentPage() {
      if (loading || summary.content) return;

      setGenerating(true);
      try {
        const pageContent = await getCurrentPageContent();

        if (!pageContent) return;

        const llm = new ChatOpenAI({
          openAIApiKey: openAIApiKey,
          //   temperature: 0,
        });

        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 4000,
        });

        const docs = await textSplitter.createDocuments([
          pageContent.pageContent,
        ]);

        const template = SUPPORTED_SUMMARY_TYPES.find(
          (type) => type.type === summary.type
        )?.template;

        if (!template) return;

        const prompt = new PromptTemplate({
          template: template,
          inputVariables: ["text"],
        });

        const chain = loadSummarizationChain(llm, {
          type: "map_reduce",
          combineMapPrompt: prompt,
          combinePrompt: prompt,
          // verbose: true,
        });
        const response = await chain.call({
          input_documents: docs,
        });

        if (ignore) return;

        // console.log({ response });

        setSummary({
          ...summary,
          content: response.text,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setGenerating(false);
      }
    }
    summarizeCurrentPage();

    return () => {
      ignore = true;
    };
  }, [loading, openAIApiKey, setSummary, summary]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {generating && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
      <div>
        <ReactMarkdown children={summary.content} />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Select
          options={summaryTypeOptions}
          value={summary.type}
          onChange={(e) => {
            setSummary({
              type: e.target.value as SummaryType["type"],
              content: "",
            });
          }}
          disabled={loading || generating}
        />
        <button
          onClick={() => {
            setSummary({
              ...summary,
              content: "",
            });
          }}
          disabled={loading || generating}
        >
          Regenerate Summary
        </button>
      </div>
    </div>
  );
}
