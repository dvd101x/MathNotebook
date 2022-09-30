example = [
  {
      "cell_type": "markdown",
      "source": [
          "# Quadratic Formula",
          "",
          "In algebra, a quadratic equation is any equation that can be rearranged in standard form as",
          "",
          "$$ ax^{2}+bx+c=0 $$",
          "",
          "The quadratic formula is",
          "",
          "$$ x=\\frac {-b \\pm \\sqrt {b^{2}-4ac}}{2a} $$"
      ]
  },
  {
      "cell_type": "mathjs",
      "source": [
          "a = 1;",
          "b = 5;",
          "c = 3;",
          "x = (-b + [1,-1] sqrt(b^2-4 a c)) / (2 a);",
          "print('With a = $a, b=$b, and c=$c', {a:a, b:b, c:c})",
          "print('x has two solutions $0 and $1', x, 4) "
      ]
  },
  {
      "cell_type": "markdown",
      "source": [
          "## Proof"
      ]
  },
  {
      "cell_type": "mathjs",
      "source": [
          "proof = a x.^2 + b x + c;",
          "print('Using x = $0 we get $1', [x[1], proof[1]], 4)",
          "print('Using x = $0 we get $1', [x[2], proof[2]], 4)"
      ]
  }
]

function cellsJoin(cells){
  return cells.map(cell => ({cell_type:cell.cell_type, source:cell.source.join('\n')}))
}

function cellsSplit(cells){
  return cells.map(cell => ({cell_type:cell.cell_type, source:cell.source.split('\n')}))
}

evalCell = {
  mathjs: code => doMath(code),
  markdown: markup => md.render(markup.join('\n')),
}

function makeReport(cells){
  parser.clear()
  let report = []
  cells.forEach(cell => {
    report.push(evalCell[cell.cell_type](cell.source))
  })
  return report.join('\n');
}

const md = markdownit({html:true})
  .use(texmath, {engine: katex,
                delimiters: ['dollars'],
                katexOptions: {macros:{"\\RR": "\\mathbb{R}"}}
                })

parser = math.parser()

math2str = x => typeof x == "string" ? x : math.format(x, 14)

function doMath(code) {
  try {
    let results = parser.evaluate(code.join('\n'))
    if(typeof results != 'undefined'){
      if (results.entries) {
        results = results.entries
          .filter(x => typeof x != 'undefined')
        if(results.length){
          results = results.map(x => math2str(x))
            .join('\n')
        }
        else{
          return ''
        }
      }
      else {
        results = math2str(results)
      }
      return '<pre>' + results + '</pre>'
    }
    else{
      return ''
    }
  } catch (error) {
    return `<pre style='color:red'>${error.toString()}</pre>`
  }
}


const wait = 250
let timer

doReport = (code) => {  document.getElementById('output').innerHTML= makeReport(code)
}

reportWithDelay = code => {
  clearTimeout(timer);
  timer = setTimeout(doReport, wait, code);
};