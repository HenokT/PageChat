import classNames from "classnames";
import { useState } from "react";
import styles from "./Popup.module.css";
import Chatbot from "./Chatbot";
import Options from "../options/Options";
import { useSettingsStore } from "../utils/useSettingsStore";
import PageSummery from "./PageSummery";

function Popup() {
  const { loading, settings } = useSettingsStore();

  const [activeTab, setActiveTab] = useState(0);

  if (loading || !settings.openAIApiKey) {
    return <Options />;
  }

  return (
    <>
      <main className={styles.container}>
        <ul className={classNames(styles.nav, styles.navTabs)}>
          <li
            className={classNames(styles.navItem, {
              [styles.active]: activeTab === 0,
            })}
          >
            <a
              href="#Chatbot"
              className={styles.navLink}
              onClick={() => setActiveTab(0)}
            >
              Chatbot
            </a>
          </li>
          <li
            className={classNames(styles.navItem, {
              [styles.active]: activeTab === 1,
            })}
          >
            <a
              href="#page-summery"
              className={styles.navLink}
              onClick={() => setActiveTab(1)}
            >
              Page Summary
            </a>
          </li>
        </ul>
        <div className={styles.tabContent}>
          {activeTab === 0 && <Chatbot />}
          {activeTab === 1 && <PageSummery />}
        </div>
      </main>
      <footer style={{ marginTop: "1rem", fontStyle: "italic", opacity: 0.75 }}>
        Powered by <a href="https://openai.com/">OpenAI</a> and{" "}
        <a href="https://js.langchain.com/docs/"> LangChain</a>
      </footer>
    </>
  );
}

export default Popup;
