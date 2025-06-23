export function generateBoxShadowCSS({ HorizOff, VertOff, Blur, Spread, thirdColor, inset }) {
  const boxShadow = `${HorizOff}px ${VertOff}px ${Blur}px ${Spread}px ${thirdColor}`;

  return inset
    ? `-webkit-box-shadow: inset ${boxShadow};
-moz-box-shadow: inset ${boxShadow};
box-shadow: inset ${boxShadow};`
    : `-webkit-box-shadow: ${boxShadow};
-moz-box-shadow: ${boxShadow};
box-shadow: ${boxShadow};`;
}
