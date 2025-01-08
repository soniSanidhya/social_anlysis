const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(
  cors({
    origin: "*",
  })
);

class LangflowClient {
  constructor(baseURL, applicationToken) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }
  async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error.message);
      throw error;
    }
  }

  async initiateSession(
    flowId,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
    tweaks = {}
  ) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks: tweaks,
    });
  }

  handleStream(streamUrl, onUpdate, onClose, onError) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = (event) => {
      console.error("Stream Error:", event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose("Stream closed");
      eventSource.close();
    });

    return eventSource;
  }

  async runFlow(
    flowIdOrName,
    langflowId,
    inputValue,
    inputType = "chat",
    outputType = "chat",
    tweaks = {},
    stream = false,
    onUpdate,
    onClose,
    onError
  ) {
    try {
      // console.log("inputvalue",inputValue);

      const initResponse = await this.initiateSession(
        flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks
      );
      // console.log('Init Response:', initResponse.outputs[0].outputs[0].results.message);
      if (
        stream &&
        initResponse &&
        initResponse.outputs &&
        initResponse.outputs[0].outputs[0].artifacts.stream_url
      ) {
        const streamUrl =
          initResponse.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }
      return initResponse;
    } catch (error) {
      console.error("Error running flow:", error);
      onError("Error initiating session");
    }
  }
}

const applicationToken = process.env.APPLiCATION_TOKEN;
const langflowClient = new LangflowClient(
  "https://api.langflow.astra.datastax.com",
  applicationToken
);

app.use(express.json());

app.post("/run-flow", async (req, res) => {
  const {
    inputValue,
    inputType = "chat",
    outputType = "chat",
    stream = false,
  } = req.body;
  // console.log("inputValue from boy",inputValue);

  const flowIdOrName = process.env.FLOW_ID;
  const langflowId = process.env.LANGFLOW_ID;
  const tweaks = {
    "ChatInput-N1vbq": {},
    "ParseData-fHlPE": {},
    "Prompt-104qe": {},
    "SplitText-Nwdjc": {},
    "OpenAIModel-Aayr9": {},
    "ChatOutput-uY12m": {},
    "AstraDB-tBkCF": {},
    "OpenAIEmbeddings-tz4gF": {},
    "AstraDB-noUp8": {},
    "OpenAIEmbeddings-9ISWC": {},
    "File-iEuOZ": {},
    "ChatOutput-y9oIr": {},
  };

  try {
    const response = await langflowClient.runFlow(
      flowIdOrName,
      langflowId,
      inputValue,
      inputType,
      outputType,
      tweaks,
      stream,
      (data) => console.log("Received:", data.chunk), // onUpdate
      (message) => console.log("Stream Closed:", message), // onClose
      (error) => console.log("Stream Error:", error) // onError
    );

    console.log("Response:", response);

    if (!stream && response && response.outputs) {
      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.message;
      console.log("from heere");

      const prompt = output?.message.text + `
       use tailwind for css syling the component`;
      console.log("prompt", prompt);

      const result = await model.generateContent(prompt);
      // res.json({ message: output.message.text });
      console.log(
        "result",
        result.response.candidates[0].content.parts[0].text
      );

      res.json(result?.response?.candidates[0]?.content.parts[0]?.text);
    } else {
      res.json(response);
    }
  } catch (error) {
    console.error("Main Error", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
