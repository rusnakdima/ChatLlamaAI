import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MdParseService {
  constructor() { }

  parseData(text: string) {
    let htmlRaw = '';
    let tempText = text;

    const supReg = new RegExp(`[\\ \\n](\\^([^\\^\\n]+)\\^)[\\ \\n\\.\\;\\:\\-\\!\\?\\(\\)\\[\\]\\{\\}]`);
    const sup = tempText.match(new RegExp(supReg.source, 'g'));
    if (sup && sup.length > 0) {
      sup.forEach((val: string) => {
        const dataReg = supReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[1], `<sup>${dataReg[2]}</sup>`);
        }
      });
    }

    const subReg = new RegExp(`[\\ \\n](\\~([^\\~\\n]+)\\~)[\\ \\n\\.\\;\\:\\-\\!\\?\\(\\)\\[\\]\\{\\}]`);
    const sub = tempText.match(new RegExp(subReg.source, 'g'));
    if (sub && sub.length > 0) {
      sub.forEach((val: string) => {
        const dataReg = subReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[1], `<sub>${dataReg[2]}</sub>`);
        }
      });
    }

    const boldReg = new RegExp(`[\\ \\n](\\*\{2\}([^\\*\\n]+)\\*\{2\})[\\ \\n\\.\\;\\:\\-\\!\\?\\(\\)\\[\\]\\{\\}]`);
    const bold = tempText.match(new RegExp(boldReg.source, 'g'));
    if (bold && bold.length > 0) {
      bold.forEach((val: string) => {
        const dataReg = boldReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[1], `<b>${dataReg[2]}</b>`);
        }
      });
    }

    const italicReg = new RegExp(`[\\ \\n](\\*([^\\*\\n]+)\\*)[\\ \\n\\.\\;\\:\\-\\!\\?\\(\\)\\[\\]\\{\\}]`);
    const italic = tempText.match(new RegExp(italicReg.source, 'g'));
    if (italic && italic.length > 0) {
      italic.forEach((val: string) => {
        const dataReg = italicReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<i>${dataReg[1]}</i>`);
        }
      });
    }

    const italicAltReg = new RegExp(`[\\ \\n](\\_([^\\_\\n]+)\\_)[\\ \\n\\.\\;\\:\\-\\!\\?\\(\\)\\[\\]\\{\\}]`);
    const italicAlt = tempText.match(new RegExp(italicAltReg.source, 'g'));
    if (italicAlt && italicAlt.length > 0) {
      italicAlt.forEach((val: string) => {
        const dataReg = italicAltReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<i>${dataReg[1]}</i>`);
        }
      });
    }

    const linkReg = new RegExp(`[\\ \\n](\\[(.+)\\]\\((.+)\\))[\\ \\n\\.\\;\\:\\-\\!\\?\\(\\)\\[\\]\\{\\}]`);
    const link = tempText.match(new RegExp(linkReg.source, 'g'));
    if (link && link.length > 0) {
      link.forEach((val: string) => {
        const dataReg = linkReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[1], `<a class="styleLinkRedir" href="${dataReg[3]}" title="${dataReg[3]}">${dataReg[2]}</a>`);
        }
      });
    }

    const codeReg = /\n*\`{3}\w*?\n([\s\S]*?)\n\`{3}\n*/;
    const code = tempText.match(new RegExp(codeReg.source, 'g'));
    if (code && code.length > 0) {
      code.forEach((val: string) => {
        const dataReg = codeReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<pre><code>${dataReg[1]}</code></pre>`);
        }
      });
    }

    const listMarkedBlockReg = new RegExp(`^((\\ *[-*+])\\ *.+\\n*)+\\n?$`);
    const listMarkedBlocks = tempText.match(new RegExp(listMarkedBlockReg.source, 'gm'));
    if (listMarkedBlocks && listMarkedBlocks.length > 0) {
      listMarkedBlocks.forEach((block: string) => {
        const dataRegBlock = listMarkedBlockReg.exec(block);
        if (dataRegBlock) {
          const listMarkedReg = new RegExp(`^(\\ *)([-*+])\\ *(.+)$`);
          const listMarked = block.match(new RegExp(listMarkedReg.source, 'gm'));
          let li = '';
          if (listMarked && listMarked.length > 0) {
            listMarked.forEach((val: string) => {
              const dataReg = listMarkedReg.exec(val);
              if (dataReg) {
                li += `<li class='ml-${4 * dataReg[1].length}'>${dataReg[3]}</li>`;
              }
            });
          }
          const ul = `<ul class="list-disc list-inside">${li}</ul>`;
          tempText = tempText.replace(dataRegBlock[0], ul);
        }
      });
    }

    const listNumericBlockReg = new RegExp(`^((\\ *\\d*\\.)\\ *.+\\n*)+\\n?$`);
    const listNumericBlocks = tempText.match(new RegExp(listNumericBlockReg.source, 'gm'));
    if (listNumericBlocks && listNumericBlocks.length > 0) {
      listNumericBlocks.forEach((block: string) => {
        const dataRegBlock = listNumericBlockReg.exec(block);
        if (dataRegBlock) {
          const listNumericReg = new RegExp(`^(\\ *)(\\d*)\\.\\ *(.+)$`);
          const listNumeric = block.match(new RegExp(listNumericReg.source, 'gm'));
          let li = '';
          let start = 1;
          if (listNumeric && listNumeric.length > 0) {
            listNumeric.forEach((val: string, i: number) => {
              const dataReg = listNumericReg.exec(val);
              if (dataReg) {
                if (i == 0) {
                  start = Number(dataReg[2]);
                }
                li += `<li class='ml-${4 * dataReg[1].length}'>${dataReg[3]}</li>`;
              }
            });
          }
          const ul = `<ol class="list-decimal list-inside" start="${start}">${li}</ol>`;
          tempText = tempText.replace(dataRegBlock[0], ul);
        }
      });
    }

    const tableBlocksReg = new RegExp(`^(\\|.*?\\|\n*)+\n?$`);
    const tableBlocks = tempText.match(new RegExp(tableBlocksReg.source, 'gm'));
    if (tableBlocks && tableBlocks.length > 0) {
      tableBlocks.forEach((block: string) => {
        const dataRegBlock = tableBlocksReg.exec(block);
        if (dataRegBlock) {
          const tableReg = new RegExp(`^\\|(.*?)\\|\n?$`);
          const table = block.match(new RegExp(tableReg.source, 'gm'));
          let tr = '';
          if (table && table.length > 0) {
            table.forEach((row: string) => {
              const dataReg = tableReg.exec(row);
              let td = '';
              if (dataReg) {
                dataReg[1].split('|').forEach((cell: string) => {
                  if (!cell.trim().split('').includes('-')) {
                    td += `<td class="styleTD">${cell}</td>`;
                  }
                });
                tr += `<tr>${td}</tr>`;
              }
            });
            const tableStr = `<table class="styleTD">${tr}</table>`;
            tempText = tempText.replace(dataRegBlock[0], tableStr);
          }
        }
      });
    }

    const h6Reg = new RegExp(`^\\ *#\{6\}\\s(.+)\\n?$`);
    const h6 = tempText.match(new RegExp(h6Reg.source, 'gm'));
    if (h6 && h6.length > 0) {
      h6.forEach((val: string) => {
        const dataReg = h6Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p class='font-bold text-[1rem]'>${dataReg[1]}</p>`);
        }
      });
    }

    const h5Reg = new RegExp(`^\\ *#\{5\}\\s(.+)\\n?$`);
    const h5 = tempText.match(new RegExp(h5Reg.source, 'gm'));
    if (h5 && h5.length > 0) {
      h5.forEach((val: string) => {
        const dataReg = h5Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p class='font-bold text-[1.125rem]'>${dataReg[1]}</p>`);
        }
      });
    }

    const h4Reg = new RegExp(`^\\ *#\{4\}\\s(.+)\\n?$`);
    const h4 = tempText.match(new RegExp(h4Reg.source, 'gm'));
    if (h4 && h4.length > 0) {
      h4.forEach((val: string) => {
        const dataReg = h4Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p class='font-bold text-[1.25rem]'>${dataReg[1]}</p>`);
        }
      });
    }

    const h3Reg = new RegExp(`^\\ *#\{3\}\\s(.+)\\n?$`);
    const h3 = tempText.match(new RegExp(h3Reg.source, 'gm'));
    if (h3 && h3.length > 0) {
      h3.forEach((val: string) => {
        const dataReg = h3Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p class='font-bold text-[1.5rem]'>${dataReg[1]}</p>`);
        }
      });
    }

    const h2Reg = new RegExp(`^\\ *#\{2\}\\s(.+)\\n?$`);
    const h2 = tempText.match(new RegExp(h2Reg.source, 'gm'));
    if (h2 && h2.length > 0) {
      h2.forEach((val: string) => {
        const dataReg = h2Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p class='font-bold text-[1.875rem]'>${dataReg[1]}</p>`);
        }
      });
    }

    const h1Reg = new RegExp(`^\\ *#\{1\}\\s(.+)\\n?$`);
    const h1 = tempText.match(new RegExp(h1Reg.source, 'gm'));
    if (h1 && h1.length > 0) {
      h1.forEach((val: string) => {
        const dataReg = h1Reg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p class='font-bold text-[2.125rem]'>${dataReg[1]}</p>`);
        }
      });
    }

    const backticksReg = new RegExp(`\`([^\\\`\\n]+)\``);
    const backticks = tempText.match(new RegExp(backticksReg.source, 'g'));
    if (backticks && backticks.length > 0) {
      backticks.forEach((val: string) => {
        const dataReg = backticksReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<span class='bg-gray-500 dark:bg-gray-600'>${dataReg[1]}</span>`);
        }
      });
    }

    const paragraphReg = new RegExp(`^(.+)\\n?$`);
    const paragraph = tempText.match(new RegExp(paragraphReg.source, 'gm'));
    if (paragraph && paragraph.length > 0) {
      paragraph.forEach((val: string) => {
        const dataReg = paragraphReg.exec(val);
        if (dataReg) {
          tempText = tempText.replace(dataReg[0], `<p>${dataReg[1]}</p>`);
        }
      });
    }

    // const brReg = new RegExp(`^\\n?$`);
    // const br = tempText.match(new RegExp(brReg.source, 'gm'));
    // if (br && br.length > 0) {
    //   br.forEach((val: string) => {
    //     const dataReg = brReg.exec(val);
    //     if (dataReg) {
    //       tempText = tempText.replace(dataReg[0], `<br />`);
    //     }
    //   });
    // }

    htmlRaw = tempText;
    return htmlRaw;
  }
}
