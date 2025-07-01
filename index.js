import { encodeMessage, decodeMessage, MAGIC_PREFIX } from "./utils";

let messageSendPatch, messageReceivePatch;

export default {
  start() {
    const { sendMessage } = findModuleByProps("sendMessage");
    const MessageEvents = findModuleByProps("dispatch", "subscribe");
    const parser = findModuleByProps("parse", "unparse");

    // Patch send message
    messageSendPatch = monkeyPatch(sendMessage, "sendMessage", {
      before: (args) => {
        const content = args[1].content;
        args[1].content = MAGIC_PREFIX + encodeMessage(content);
      }
    });

    // Listen to message receive event
    messageReceivePatch = MessageEvents.subscribe("MESSAGE_CREATE", (e) => {
      const msg = e.message;
      if (msg.content.startsWith(MAGIC_PREFIX)) {
        const raw = msg.content.slice(MAGIC_PREFIX.length);
        msg.content = decodeMessage(raw);
      }
    });
  },

  stop() {
    messageSendPatch?.(); 
    MessageEvents.unsubscribe("MESSAGE_CREATE", messageReceivePatch);
  }
};
