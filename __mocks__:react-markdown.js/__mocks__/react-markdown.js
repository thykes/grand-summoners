// __mocks__/react-markdown.js
import React from 'react';

export default function ReactMarkdown(props) {
  return <div data-testid="mock-react-markdown">{props.children}</div>;
}
