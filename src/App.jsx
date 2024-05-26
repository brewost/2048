import './App.css'

function App() {

  const gridData = [[2, 4, 2, 4], [null, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, null]];

  function handleKeyUp(e) {
    if (!["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(e.code)) return;
    console.log(e.code);
  }

  return (
    <section tabIndex="1" className="grid-wrapper" onKeyUp={handleKeyUp}>
      {gridData.map((row, x) => {
        return(
        row.map((cell, y) => {
          return <div className="  cell" key={x + "." + y} >{cell ? cell : "---"}<span>{"cell: " + x + "." + y }</span></div>
        }))
      })}
    </section>
  )
}

export default App
