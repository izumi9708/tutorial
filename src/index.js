import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { useState , useEffect } from 'react';


function Square(i){
  return (
    <button className="square"
            onClick={()=>i.onClick()}>
      {i.value}
    </button>
  );
}

function Board(props){

  function renderSquare(i) {
    
    return <Square value={props.square[i]}
                    onClick={()=>props.handleClick(i)}
                    turn={props.turn}/>;
  }
  
  return (
    <div>
      <div className="status"></div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}


function Game() {
  const [history,setHistory] = useState([Array(9).fill(null)]); // マス分の配列を作る（初期値はnull）
  const [turn,changeTurn] = useState('x');
  const [currentNumber,changeCurrent] = useState(0);
  const [gameState,changeGame] = useState(true);

  function handleClick(i){ // renderはreturnないのみリロードなのでsquareを直接変更せずコピーを作る
    const historyNullLength = history[currentNumber].filter( val => val === null ) // ( 引き分け判定 ) 配列のnullを数える
    
    if(winner !== null || historyNullLength.length == 0 || history[currentNumber][i]){ // 勝者がいる時、nullが０の時、クリックした箇所が空じゃない時
      return false

    }else {
      const currentHistory = history.slice(0,currentNumber + 1);
      const copySquare = history[currentNumber].slice(); // historyの最後の配列をコピーする
      copySquare[i] = turn;
      setHistory(currentHistory.concat([copySquare]));
      changeCurrent(currentNumber + 1);
      turn == 'x' ? changeTurn('o') : changeTurn('x');
    }
  }

  function jumpStatus(index){
    changeCurrent(index);
    changeTurn((index % 2) === 0 ? 'x' : 'o');
  }

  const winner = calculateWinner(history[currentNumber]);
  let status;

  ( winner !== null ) ? status = `winner : ${winner}` : status = 'Next player:' + turn;

  const timeTravel = history.map((val,index) => {
    const desc = index ?
        'Go to move #' + index :
        'Go to game start';
    return (
      <li key={index}>
        <button onClick={()=>jumpStatus(index)}>{desc}</button>
      </li>
    )
  } )


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            square={history[currentNumber]}
            turn={turn}
            handleClick={(i)=>handleClick(i)}
            status={status}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{timeTravel}</ol>
        </div>
      </div>
    );
}


function calculateWinner(squares) {
  console.log(squares);
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a]) { // line配列の各b番目c番目がa番目と等しければ
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
