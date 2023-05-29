import { loadSummarizationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { useEffect, useMemo, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useStoredState } from "../utils/useStoredState";
import { Loader } from "./loader/Loader";
import { Select, SelectProps } from "./select/Select";
import { StorageKeys } from "../utils/constants";
import { useSettingsStore } from "../utils/useSettingsStore";
import { getCurrentPageContent } from "../utils/getPageContent";

type SummeryType = {
  type: "concise" | "detailed" | "table-of-content";
  label: string;
  template: string; //| ((input: Record<string, string>) => string);
};

const SUPPORTED_SUMMERY_TYPES: SummeryType[] = [
  {
    type: "concise",
    label: "Concise",
    template: `Write a concise summery of the following in markdown format:


"{text}"


CONCISE SUMMARY:`,
  },
  {
    type: "detailed",
    label: "Detailed",
    template: `Write a detailed summery of the following in markdown format:


"{text}"


DETAILED SUMMERY:`,
  },
  {
    type: "table-of-content",
    label: "Table of Content",
    template: `Generate a table of content of the following in markdown format. If the table of contents already exists, use it:


"{text}"


TABLE OF CONTENT:`,
  },
  //   {
  //     type: "topics",
  //     label: "Topics",
  //     template: `What are the topics discussed in following:

  // "{text}"

  // Topics:`,
  //   },
];

type StoredSummery = {
  type: SummeryType["type"];
  content: string;
};

const INITIAL_SUMMERY = {
  type: SUPPORTED_SUMMERY_TYPES[0].type,
  content: "",
};

export default function PageSummery() {
  const {
    settings: { openAIApiKey },
  } = useSettingsStore();
  const [generating, setGenerating] = useState(false);
  const [loading, summery, setSummery] = useStoredState<StoredSummery>({
    storageKey: StorageKeys.PAGE_SUMMERY,
    defaultValue: INITIAL_SUMMERY,
  });

  const summeryTypeOptions = useMemo<SelectProps["options"]>(
    () =>
      SUPPORTED_SUMMERY_TYPES.map((type) => ({
        label: type.label,
        value: type.type,
      })),
    []
  );

  useEffect(() => {
    let ignore = false;

    async function summarizeCurrentPage() {
      if (loading || summery.content) return;

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

        const template = SUPPORTED_SUMMERY_TYPES.find(
          (type) => type.type === summery.type
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

        console.log({ response });

        setSummery({
          ...summery,
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
  }, [loading, openAIApiKey, setSummery, summery]);

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
        <ReactMarkdown children={summery.content} />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Select
          options={summeryTypeOptions}
          value={summery.type}
          onChange={(e) => {
            setSummery({
              type: e.target.value as SummeryType["type"],
              content: "",
            });
          }}
          disabled={loading || generating}
        />
        <button
          onClick={() => {
            setSummery({
              ...summery,
              content: "",
            });
          }}
          disabled={loading || generating}
        >
          Regenerate Summery
        </button>
      </div>
    </div>
  );
}
