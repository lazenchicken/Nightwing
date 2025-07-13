import React from 'react';
import ReactTooltip from 'react-tooltip';

export default function Tooltip({ id, text }: { id: string; text: string }) {
  return (
    <>
      <span data-tip data-for={id} style={{ cursor:'help', marginLeft:4 }}>❔</span>
      <ReactTooltip id={id} effect="solid">{text}</ReactTooltip>
    </>
  );
}
