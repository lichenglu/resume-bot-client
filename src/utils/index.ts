import { MessageProps } from "@chatui/core";
import { protos } from "@google-cloud/dialogflow-cx";
import { flatten } from "ramda";

import { DialogFlowMessage, MessageTypes } from "../types";

export const transformDialogflowToChatUI = (
  response: protos.google.cloud.dialogflow.cx.v3.IDetectIntentResponse
): MessageProps[] => {
  const id = response.responseId!;
  return flatten<MessageProps[][][]>(
      // @ts-ignore
    response.queryResult?.responseMessages?.map((msg, idx) => {
      if (msg.text) {
        return {
          _id: `${id}_${idx}`,
          type: MessageTypes.text,
          content: {
            text: msg.text.text?.[0],
          },
          position: "left",
        };
      }

      if (msg.payload) {
        // @ts-ignore
        return msg.payload.richContent.map(
          (richContent: DialogFlowMessage[], idx2) => {
            return richContent.map((content, idx3) => {
              if (!content) {
                return undefined;
              }

              if (content.options && content.type === MessageTypes.chips) {
                return {
                  _id: `${id}_${idx}_${idx2}_${idx3}`,
                  type: content.type,
                  content: {
                    items: content.options.map((opt, idx4) => {
                      return {
                        _id: `${id}_${idx}_${idx2}_${idx3}_${idx4}`,
                        text: opt.text,
                        actionLink: opt.link,
                        imgUrl: opt.image?.src,
                        position: "left",
                      };
                    }),
                  },
                  position: "left",
                };
              }

              return {
                _id: `${id}_${idx}_${idx2}_${idx3}`,
                type: content.type,
                content: {
                  text: content.title ?? content.text,
                  items: Array.isArray(content.text)
                    ? content.text
                    : content.items
                    ? content.items.map((item, idx4) => ({
                        _id: `${id}_${idx}_${idx2}_${idx3}_${idx4}`,
                        type: content.type,
                        text: item.title ?? item.text,
                        actionLink: item.actionLink ?? item.link,
                        description: item.subtitle ?? item.description,
                        imgUrl: item.rawUrl ?? item.image?.src,
                        event: item.event,
                    }))
                    : [],
                  actionLink: content.actionLink ?? content.link,
                  description: content.subtitle,
                  imgUrl: content.rawUrl ?? content.image?.src,
                  event: content.event,
                },
                position: "left",
              };
            });
          }
        );
      }

      return {
        _id: id,
        type: MessageTypes.text,
        position: "left",
      };
    })
  ).filter((msg) => !!msg);
};

export const trimString = (str: string, limit: number = 100) => {
  return str.slice(0, limit + 1) + "...";
};
