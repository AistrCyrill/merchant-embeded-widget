
const renderIframe = ({ attrs }) => {
  const $el = document.createElement('iframe');

  // Set attributes to iframe
  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v);
  }
  // Returns an iframe
  return $el;
};

const render = (node) => {
  return renderIframe(node);
}

export default render;