import { useState } from "react";
import Chat, {
  Bubble,
  Button,
  Image,
  List,
  ListItem,
  Card,
  CardMedia,
  CardTitle,
  CardText,
  Tag,
  useMessages,
  MessageProps,
} from "@chatui/core";
import "@chatui/core/dist/index.css";
import styled from "styled-components";

import schnauzerImg from "./assets/schnauzer.png";
import { MessageTypes } from "./types";

import { talkToAgent } from "./api";
import { transformDialogflowToChatUI } from "./utils";

const Container = styled.div`
  .ChatApp {
    position: absolute;
    min-height: 600px;
    height: 60vh;
    width: 480px;
    bottom: calc(24px + 64px);
    right: calc(24px + 64px);
  }
`;

const Toggle = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  position: absolute;
  bottom: 24px;
  right: 24px;
`;

function App() {
  const [chatboxOpen, setChatboxOpen] = useState(true);
  const [navTitle, setNavTitle] = useState("Smoky, the Algebra Bot");

  const { messages, appendMsg, setTyping } = useMessages([]);

  const handleSend = async (type: string, val: string) => {
    if (type === MessageTypes.text && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      // call api
      const res = await talkToAgent({ message: val });
      if (res.ok && res.data) {
        const msgs = transformDialogflowToChatUI(res.data!);
        console.log(msgs)
        msgs.forEach((msg) => appendMsg(msg));
      }

      setTyping(false);
    }
  };

  const renderMessageContent = (msg: MessageProps) => {
    const { content, type } = msg;
    switch (type) {
      case MessageTypes.text:
        return <Bubble content={content.text} />;
      case MessageTypes.image:
        return <Image src={content.imgUrl} width="80%" lazy/>;
      case MessageTypes.button:
        return (
          <Button
            variant='float'
            label={content.text}
            onClick={() => handleSend(MessageTypes.text, content.text)}
          />
        );
      case MessageTypes.chips:
        // @ts-ignore
        return <Tag onClick={() => content.actionLink ?? window.open(content.url, "_blank")} color='warning'>{content.text}</Tag>
      case MessageTypes.info:
        return (
          <Card
            // @ts-ignore
            onClick={() => content.actionLink ?? window.open(content.url, "_blank")}
          >
            {content.imgUrl && <CardMedia image={content.imgUrl} />}
            <CardTitle title={content.text} />
            {/* @ts-ignore */}
            <CardText>{content.description as string}</CardText>
          </Card>
        );
      case MessageTypes.list:
        return (
          // @ts-check
          <List>
            <CardTitle title={content.text} />
            {content.items.map((item: string) => {
              return <ListItem content={item} />;
            })}
          </List>
        );
    }
  };

  return (
    <Container>
      {chatboxOpen && (
        <Chat
          navbar={{ title: navTitle }}
          messages={messages}
          renderMessageContent={renderMessageContent}
          onSend={handleSend}
        />
      )}
      <Toggle src={schnauzerImg} />
    </Container>
  );
}

export default App;
