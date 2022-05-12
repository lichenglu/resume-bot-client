import styled from 'styled-components';

export const AppContainer = styled.div`
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

export const TagContainer = styled.div`
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
`