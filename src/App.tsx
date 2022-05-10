import { useEffect, useState } from "react";
import Chat, {
  Bubble,
  Button,
  Divider,
  Card,
  CardMedia,
  CardTitle,
  CardText,
  ScrollView,
  Stepper,
  Step,
  Flex,
  FlexItem,
  useMessages,
  MessageProps,
} from "@chatui/core";
import { Tag, Avatar, Image } from "antd";
import { BulbOutlined } from "@ant-design/icons";

import "@chatui/core/dist/index.css";
import styled from "styled-components";

import schnauzerImg from "./assets/schnauzer.png";
import { MessageTypes } from "./types";
import mockMessages from "./mock/messages.json";

import { talkToAgent } from "./api";
import { transformDialogflowToChatUI, trimString } from "./utils";
import TruncatedList from "./components/truncatedList";

const Container = styled.div`
  .ChatApp {
    position: absolute;
    min-height: 720px;
    height: 60vh;
    width: 540px;
    bottom: calc(24px + 64px);
    right: calc(24px + 64px);

    .ScrollView-inner {
      padding: 4px;
    }

    .ScrollView-item {
      transition: margin 0.2s ease-in-out, box-shadow 0.2s;
      &:hover {
        margin-top: -3px;
      }
    }

    .ant-tag {
      cursor: pointer;
      &:hover {
        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
      }
    }

    .Card {
      width: 260px;
      cursor: pointer;
      height: 174px;
      &:hover {
        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
      }
    }

    .Card.resource-with-img {
      height: 338px;
    }
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

const defaultQuickReplies = [
  {
    icon: "message",
    name: "Help",
    isHighlight: true,
  },
  {
    icon: "compass",
    name: "Solve/simplify",
    isHighlight: true,
  },
  {
    icon: "search",
    name: "Recommend",
    isHighlight: true,
  },
  {
    icon: "smile",
    name: "Joke",
    isHighlight: true,
  },
];

let MATH_JAX_TIMER: NodeJS.Timer

function App() {
  const [chatboxOpen, setChatboxOpen] = useState(true);
  const [navTitle, setNavTitle] = useState("Smoky, the Algebra Bot");

  const { messages, appendMsg, setTyping } = useMessages([]);

  useEffect(() => {
    clearTimeout(MATH_JAX_TIMER)
    MATH_JAX_TIMER = setTimeout(() => {
      if (window.MathJax && typeof window.MathJax.typeset === "function") {
        window.MathJax.typeset();
      }
    }, 1000)
    return () => {
      clearTimeout(MATH_JAX_TIMER)
    }
  }, [messages])

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
        console.log(msgs);
        msgs.forEach((msg) => appendMsg(msg));
      }

      setTyping(false);
    }
  };

  const renderMessageContent = (msg: MessageProps) => {
    const { content, type, position } = msg;
    let contentComponent;
    switch (type) {
      case MessageTypes.text:
        contentComponent = <Bubble content={content.text} />;
        break;
      case MessageTypes.image:
        contentComponent = (
          <Image
            width={"50%"}
            src={content.imgUrl}
            placeholder={
              <Image
                preview={false}
                src="data:image/png;base64,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"
                width={200}
              />
            }
          />
        );
        break;
      case MessageTypes.button:
        contentComponent = (
          <Button
            variant="float"
            label={content.text}
            onClick={() => handleSend(MessageTypes.text, content.text)}
          />
        );
        break;
      case MessageTypes.chips:
        contentComponent = (
          <ScrollView
            data={content.items}
            renderItem={(item) => {
              return (
                <Tag
                  key={item._id}
                  icon={<BulbOutlined />}
                  onClick={() =>
                    item.actionLink && window.open(item.actionLink, "_blank")
                  }
                  color="magenta"
                >
                  {item.text}
                </Tag>
              );
            }}
          />
        );
        break;
      case MessageTypes.info:
        contentComponent =
          content.items?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <Divider>{content.text}</Divider>
              <ScrollView
                data={content.items}
                renderItem={(item) => {
                  return (
                    <Card
                      key={item._id}
                      className={item.imgUrl ? "resource-with-img" : ""}
                      // @ts-ignore
                      onClick={() =>
                        item.actionLink &&
                        window.open(item.actionLink, "_blank")
                      }
                    >
                      {item.imgUrl && (
                        <CardMedia image={item.imgUrl} aspectRatio="wide" />
                      )}
                      {item.text && (
                        <CardTitle title={trimString(item.text, 50)} />
                      )}
                      {/* @ts-ignore */}
                      {item.description && (
                        <CardText>{trimString(item.description)}</CardText>
                      )}
                    </Card>
                  );
                }}
              />
            </div>
          ) : (
            <Card
              // @ts-ignore
              onClick={() => window.open(content.actionLink, "_blank")}
            >
              {content.imgUrl && (
                <CardMedia image={content.imgUrl} aspectRatio="wide" />
              )}
              <CardTitle title={trimString(content.text, 50)} />
              {/* @ts-ignore */}
              {content.description && (
                <CardText>{trimString(content.description)}</CardText>
              )}
            </Card>
          );
        break;
      case MessageTypes.description:
        console.log(content);
        contentComponent = (
          <div>
            <Divider>{content.text as string}</Divider>
            <Bubble>
              <TruncatedList
                items={content.items}
                renderItem={({ text, description, _id }) => (
                  <div className="listItem" key={_id}>
                    <h3>{text}</h3>
                    <p>{description}</p>
                  </div>
                )}
              />
            </Bubble>
          </div>
        );
        break;
    }

    if (
      [
        MessageTypes.chips,
        MessageTypes.info,
        MessageTypes.description,
        MessageTypes.button,
      ].includes(type)
    ) {
      return contentComponent;
    }

    const isChatbot = position === "left";
    const avatarStle = { color: "#f56a00", backgroundColor: "#fde3cf" };

    return (
      <Flex direction={isChatbot ? "row" : "row-reverse"}>
        {isChatbot ? (
          <Avatar style={avatarStle} src={schnauzerImg} size={40} />
        ) : (
          <Avatar style={avatarStle} size={40}>
            You
          </Avatar>
        )}
        <div style={{ width: 4 }} />
        <FlexItem>{contentComponent}</FlexItem>
      </Flex>
    );
  };

  const handleQuickReplyClick = (item: any) => {
    handleSend("text", item.name);
  };

  return (
    <Container>
      {chatboxOpen && (
        <Chat
          navbar={{ title: navTitle }}
          messages={messages}
          renderMessageContent={renderMessageContent}
          onSend={handleSend}
          quickReplies={defaultQuickReplies}
          onQuickReplyClick={handleQuickReplyClick}
          locale="en-US"
          // toolbar={[
          //   {
          //     title: '公告',
          //     type: 'richtext',
          //   },
          // ]}
        />
      )}
      <Toggle src={schnauzerImg} />
    </Container>
  );
}

export default App;
