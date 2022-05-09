import { MessageProps } from "@chatui/core";
import { protos } from '@google-cloud/dialogflow-cx'
import { flatten } from 'ramda';

import { DialogFlowMessage, MessageTypes } from '../types'

export const transformDialogflowToChatUI = (response: protos.google.cloud.dialogflow.cx.v3.IDetectIntentResponse): MessageProps[] => {
    const id = response.responseId!
    // @ts-ignore
    return flatten<MessageProps[][][]>(response.queryResult?.responseMessages?.map((msg, idx) => {
        if (msg.text) {
            return {
                _id: `${id}_${idx}`,
                type: MessageTypes.text,
                content: {
                    text: msg.text.text?.[0]
                },
                position: "left"
            }
        }

        if (msg.payload) {
            // @ts-ignore
            return msg.payload.richContent.map((richContent: DialogFlowMessage[], idx2) => {
                return richContent.map((content, idx3) => {
                    if (!content) {
                        return undefined
                    }

                    if (content.options && content.type === MessageTypes.chips) {
                        return content.options.map((opt, idx4) => {
                            return {
                                _id: `${id}_${idx}_${idx2}_${idx3}_${idx4}`,
                                type: content.type,
                                content: {
                                    text: opt.text,
                                    actionLink: opt.text,
                                    imgUrl: opt.image?.src
                                },
                                position: "left"
                            }
                        })
                    }
                    return {
                        _id: `${id}_${idx}_${idx2}_${idx3}`,
                        type: content.type,
                        content: {
                            text: content.title ?? content.text,
                            items: Array.isArray(content.text) ? content.text : undefined,
                            actionLink: content.actionLink ?? content.link,
                            description: content.subtitle,
                            imgUrl: content.rawUrl ?? content.image?.src,
                            event: content.event,
                        },
                        position: "left"
                    }
                })
            })
        }
        
        return {
            _id: id,
            type: MessageTypes.text,
            position: "left"
        }
    })).filter(msg => !!msg)
}