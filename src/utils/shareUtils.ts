export const buildSettlementShareText = (groupName: string, lines: string[]) => {
  return [`${groupName} - Settlement Summary`, '', ...lines].join('\n');
};
