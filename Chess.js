const globalState = initGame();
const ROOT_DIV = document.getElementById("root");
const globalPiece = new Object();
let keySquareMapper = {};


globalState.flat().forEach((square) => {
  keySquareMapper[square.id] = square;
});
  
initGameRender(globalState);
GlobalEvent();
  
String.prototype.replaceAt = function (index, replacement) {
  return (
      this.substring(0, index) +
      replacement +
      this.substring(index + replacement.length)
  );
};

// function to check if piece exists of opponent
function checkPieceOfOpponentOnElement(id, color) {
  const opponentColor = color === "white" ? "BLACK" : "WHITE";

  const element = keySquareMapper[id];

  if (!element) return false;

  if (element.piece && element.piece.piece_name.includes(opponentColor)) {
      const el = document.getElementById(id);
      el.classList.add("captureColor");
      element.captureHighlight = true;
      return true;
  }

  return false;
}
  
  // function to check if piece exists of opponent
function checkPieceOfOpponentOnElementNoDom(id, color) {
  const opponentColor = color === "white" ? "BLACK" : "WHITE";

  const element = keySquareMapper[id];

  if (!element) return false;

  if (element.piece && element.piece.piece_name.includes(opponentColor)) {
      return true;
  }

  return false;
}

// function to check weather piece exists or not by square-id
function checkWeatherPieceExistsOrNot(squareId) {
  const square = keySquareMapper[squareId];

  if (square.piece) {
      return square;
  } else {
      return false;
  }
}

// function to check capture id square
function checkSquareCaptureId(array) {
  let returnArray = [];

  for (let index = 0; index < array.length; index++) {
      const squareId = array[index];
      const square = keySquareMapper[squareId];

      if (square.piece) {
          break;
      }
      returnArray.push(squareId);
  }

  return returnArray;
}
  
  // function to give highlight ids for bishop
function giveBishopHighlightIds(id) {
  let finalReturnArray = [];

  // will give top left id
  function topLeft(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];

      while (alpha != "a" && num != 8) {
          alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
          num = num + 1;
          resultArray.push(`${alpha}${num}`);
      }

      return resultArray;
  }

  // find bottom left ids
  function bottomLeft(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];

      while (alpha != "a" && num != 1) {
          alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
          num = num - 1;
          resultArray.push(`${alpha}${num}`);
      }

      return resultArray;
  }

  // find top right ids
  function topRight(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];

      while (alpha != "h" && num != 8) {
          alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
          num = num + 1;
          resultArray.push(`${alpha}${num}`);
      }

      return resultArray;
  }

  // find bottom right ids
  function bottomRight(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];

      while (alpha != "h" && num != 1) {
          alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
          num = num - 1;
          resultArray.push(`${alpha}${num}`);
      }

      return resultArray;
  }

  return {
      topLeft: topLeft(id),
      bottomLeft: bottomLeft(id),
      topRight: topRight(id),
      bottomRight: bottomRight(id),
  };
}
  
  function giveBishopCaptureIds(id, color){
  
    if(!id){
      return [];
    }
  
    let hightlightSquareIds = giveBishopHighlightIds(id);
  
    let temp = [];
    const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;
    let returnArr = [];
  
    // insert into temp
    temp.push(bottomLeft);
    temp.push(topLeft);
    temp.push(bottomRight);
    temp.push(topRight);
    
    for (let index = 0; index < temp.length; index++) {
      const arr = temp[index];
  
      for (let j = 0; j < arr.length; j++) {
        const element = arr[j];
  
        let checkPieceResult = checkWeatherPieceExistsOrNot(element);
        if (
          checkPieceResult &&
          checkPieceResult.piece &&
          checkPieceResult.piece.piece_name.toLowerCase().includes(color)
        ) {
          break;
        }
  
        if (checkPieceOfOpponentOnElementNoDom(element, color)) {
          returnArr.push(element)
          break;
        }
      }
    }
  
   
    return returnArr;
  
  }
  
  function giveRookCapturesIds(id,color){
  
    if(!id)
    {
      return [];
    }
  
    let hightlightSquareIds = giveRookHighlightIds(id);
  
    let temp = [];
    const { bottom, top, right, left } = hightlightSquareIds;
    let returnArr = [];
  
    // insert into temp
    temp.push(bottom);
    temp.push(top);
    temp.push(right);
    temp.push(left);
    
    for (let index = 0; index < temp.length; index++) {
      const arr = temp[index];
  
      for (let j = 0; j < arr.length; j++) {
        const element = arr[j];
  
        let checkPieceResult = checkWeatherPieceExistsOrNot(element);
        if (
          checkPieceResult &&
          checkPieceResult.piece &&
          checkPieceResult.piece.piece_name.toLowerCase().includes(color)
        ) {
          break;
        }
  
        if (checkPieceOfOpponentOnElementNoDom(element, color)) {
          returnArr.push(element)
          break;
        }
      }
    }
  
    return returnArr;
  
  }
  
  function giveQueenCapturesIds(id,color){
  
    if(!id) return [];
  
    let returnArr = [];
    returnArr.push(giveBishopCaptureIds(id, color))
    returnArr.push(giveRookCapturesIds(id, color))
    return returnArr.flat();
  }
  
  // function to give highlight ids for rook
  function giveRookHighlightIds(id) {
    let finalReturnArray = [];
  
    // will give top left id
    function top(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      while (num != 8) {
        // alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
        num = num + 1;
        resultArray.push(`${alpha}${num}`);
      }
  
      return resultArray;
    }
  
    // find bottom left ids
    function bottom(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      while (num != 1) {
        // alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
        num = num - 1;
        resultArray.push(`${alpha}${num}`);
      }
  
      return resultArray;
    }
  
    // find top right ids
    function right(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      while (alpha != "h") {
        alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
        // num = num + 1;
        resultArray.push(`${alpha}${num}`);
      }
  
      return resultArray;
    }
  
    // find bottom right ids
    function left(id) {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      while (alpha != "a") {
        alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
        // num = num + 1;
        resultArray.push(`${alpha}${num}`);
      }
  
      return resultArray;
    }
  
    return {
      top: top(id),
      bottom: bottom(id),
      right: right(id),
      left: left(id),
    };
  }
  
  // function to give highlight ids for knight
  function giveKnightHighlightIds(id) {
  
    if (!id) {
      return;
    }
  
    function left() {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      let temp = 0;
  
      while (alpha != "a") {
        if (temp == 2) {
          break;
        }
  
        alpha = String.fromCharCode(alpha.charCodeAt(0) - 1);
        resultArray.push(`${alpha}${num}`);
        temp += 1;
      }
  
      if (resultArray.length == 2) {
        let finalReturnArray = [];
  
        const lastElement = resultArray[resultArray.length - 1];
        let alpha = lastElement[0];
        let number = Number(lastElement[1]);
        if (number < 8) {
          finalReturnArray.push(`${alpha}${number + 1}`);
        }
        if (number > 1) {
          finalReturnArray.push(`${alpha}${number - 1}`);
        }
        return finalReturnArray
      } else {
        return [];
      }
    }
  
    function top() {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      let temp = 0;
  
      while (num != "8") {
        if (temp == 2) {
          break;
        }
  
        num = num + 1;
        // alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
        resultArray.push(`${alpha}${num}`);
        temp += 1;
      }
  
      if (resultArray.length == 2) {
        let finalReturnArray = [];
  
        const lastElement = resultArray[resultArray.length - 1];
        let alpha = lastElement[0];
        let number = Number(lastElement[1]);
        if (alpha != "h") {
          let alpha2 = String.fromCharCode(alpha.charCodeAt(0) + 1);
          finalReturnArray.push(`${alpha2}${number}`);
        }
        if (alpha != "a") {
          let alpha2 = String.fromCharCode(alpha.charCodeAt(0) - 1);
          finalReturnArray.push(`${alpha2}${number}`);
        }
        // resultArray.push(`${Number(lastElement[1])}`);
  
        return finalReturnArray;
      } else {
        return [];
      }
    }
  
    function right() {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      let temp = 0;
  
      while (alpha != "h") {
        if (temp == 2) {
          break;
        }
  
        alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
        resultArray.push(`${alpha}${num}`);
        temp += 1;
      }
  
      if (resultArray.length == 2) {
        let finalReturnArray = [];
  
        const lastElement = resultArray[resultArray.length - 1];
        let alpha = lastElement[0];
        let number = Number(lastElement[1]);
        if (number < 8) {
          finalReturnArray.push(`${alpha}${number + 1}`);
        }
        if (number > 1) {
          finalReturnArray.push(`${alpha}${number - 1}`);
        }
        // resultArray.push(`${Number(lastElement[1])}`);
  
        return finalReturnArray;
      } else {
        return [];
      }
    }
  
    function bottom() {
      let alpha = id[0];
      let num = Number(id[1]);
      let resultArray = [];
  
      let temp = 0;
  
      while (num != "1") {
        if (temp == 2) {
          break;
        }
  
        num = num - 1;
        // alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);
        resultArray.push(`${alpha}${num}`);
        temp += 1;
      }
  
      if (resultArray.length == 2) {
        let finalReturnArray = [];
  
        const lastElement = resultArray[resultArray.length - 1];
        let alpha = lastElement[0];
        let number = Number(lastElement[1]);
        if (alpha != "h") {
          let alpha2 = String.fromCharCode(alpha.charCodeAt(0) + 1);
          finalReturnArray.push(`${alpha2}${number}`);
        }
        if (alpha != "a") {
          let alpha2 = String.fromCharCode(alpha.charCodeAt(0) - 1);
          finalReturnArray.push(`${alpha2}${number}`);
        }
        // resultArray.push(`${Number(lastElement[1])}`);
  
        return finalReturnArray;
      } else {
        return [];
      }
    }
  
    return [...top(), ...bottom(), ...left(), ...right()];
  }
  
  
  function giveKnightCaptureIds(id, color) {
  
    if (!id) {
      return [];
    }
  
    let returnArr  = giveKnightHighlightIds(id);
  
    returnArr = returnArr.filter(element => {
      if(checkPieceOfOpponentOnElementNoDom(element, color)){
        return true;
      }
    });
  
    return returnArr;
  }
  
  // function to give highlight ids for queen
  function giveQueenHighlightIds(id){
    const rookMoves = giveRookHighlightIds(id)
    const bishopMoves = giveBishopHighlightIds(id);
    return {
      "left": rookMoves.left,
      "right" :rookMoves.right,
      "top" : rookMoves.top,
      "bottom" : rookMoves.bottom,
      "topLeft": bishopMoves.topLeft,
      "topRight": bishopMoves.topRight,
      "bottomLeft" : bishopMoves.bottomLeft,
      "bottomRight" : bishopMoves.bottomRight
    }
  }
  
  function giveKingHighlightIds(id){
    const rookMoves = giveRookHighlightIds(id)
    const bishopMoves = giveBishopHighlightIds(id);
    const returnResult =  {
      "left": rookMoves.left,
      "right" :rookMoves.right,
      "top" : rookMoves.top,
      "bottom" : rookMoves.bottom,
      "topLeft": bishopMoves.topLeft,
      "topRight": bishopMoves.topRight,
      "bottomLeft" : bishopMoves.bottomLeft,
      "bottomRight" : bishopMoves.bottomRight
    }
  
    for (const key in returnResult) {
      if (Object.hasOwnProperty.call(returnResult, key)) {
        const element = returnResult[key];
  
        if(element.length != 0){
          returnResult[key] = new Array(element[0]);
        }
        
      }
    }
  
    return returnResult;
  }
  function giveKingCaptureIds(id, color){
  
    if(!id) {
      return [];
    }
  
    let result = giveKingHighlightIds(id);
    result = Object.values(result).flat();
    result = result.filter(element => {
      if(checkPieceOfOpponentOnElementNoDom(element, color)){
        return true;
      }
    })
  
    return result;
  }

// for each square
function Square(color, id, piece) {
    return { color, id, piece };
  }
  
  function SquareRow(rowId) {
    const squareRow = [];
    const abcd = ["a", "b", "c", "d", "e", "f", "g", "h"];
  
    if (rowId % 2 == 0) {
      abcd.forEach((element, index) => {
        if (index % 2 == 0) {
          squareRow.push(Square("white", element + rowId, null));
        } else {
          squareRow.push(Square("black", element + rowId, null));
        }
      });
    } else {
      abcd.forEach((element, index) => {
        if (index % 2 == 0) {
          squareRow.push(Square("black", element + rowId, null));
        } else {
          squareRow.push(Square("white", element + rowId, null));
        }
      });
    }
  
    return squareRow;
  }
  
  function initGame() {
    return [
      SquareRow(8),
      SquareRow(7),
      SquareRow(6),
      SquareRow(5),
      SquareRow(4),
      SquareRow(3),
      SquareRow(2),
      SquareRow(1),
    ];
  }

   // hightlighted or not => state
   let hightlight_state = false;
   let inTurn = "white";
   let whoInCheck = null;
   
   function changeTurn() {
     inTurn = inTurn === "white" ? "black" : "white";
   }
   
   function checkForCheck() {
     if (inTurn === "black") {
       const whiteKingCurrentPosition = globalPiece.white_king.current_position;
       const knight_1 = globalPiece.black_knight_1.current_position;
       const knight_2 = globalPiece.black_knight_2.current_position;
       const king = globalPiece.black_king.current_position;
       const bishop_1 = globalPiece.black_bishop_1.current_position;
       const bishop_2 = globalPiece.black_bishop_2.current_position;
       const rook_1 = globalPiece.black_rook_1.current_position;
       const rook_2 = globalPiece.black_rook_2.current_position;
       const queen = globalPiece.black_queen.current_position;
   
       let finalCheckList = [];
       finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
       finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
       finalCheckList.push(giveKingCaptureIds(king, inTurn));
       finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
       finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
       finalCheckList.push(giveRookCapturesIds(rook_1, inTurn));
       finalCheckList.push(giveRookCapturesIds(rook_2, inTurn));
       finalCheckList.push(giveQueenCapturesIds(queen, inTurn));
   
       finalCheckList = finalCheckList.flat();
       const checkOrNot = finalCheckList.find(
         (element) => element === whiteKingCurrentPosition
       );
   
       if (checkOrNot) {
         whoInCheck = "white";
       }
     } else {
       const blackKingCurrentPosition = globalPiece.black_king.current_position;
       const knight_1 = globalPiece.white_knight_1.current_position;
       const knight_2 = globalPiece.white_knight_2.current_position;
       const king = globalPiece.white_king.current_position;
       const bishop_1 = globalPiece.white_bishop_1.current_position;
       const bishop_2 = globalPiece.white_bishop_2.current_position;
       const rook_1 = globalPiece.white_rook_1.current_position;
       const rook_2 = globalPiece.white_rook_2.current_position;
       const queen = globalPiece.white_queen.current_position;
   
       let finalCheckList = [];
       finalCheckList.push(giveKnightCaptureIds(knight_1, inTurn));
       finalCheckList.push(giveKnightCaptureIds(knight_2, inTurn));
       finalCheckList.push(giveKingCaptureIds(king, inTurn));
       finalCheckList.push(giveBishopCaptureIds(bishop_1, inTurn));
       finalCheckList.push(giveBishopCaptureIds(bishop_2, inTurn));
       finalCheckList.push(giveRookCapturesIds(rook_1, inTurn));
       finalCheckList.push(giveRookCapturesIds(rook_2, inTurn));
       finalCheckList.push(giveQueenCapturesIds(queen, inTurn));
   
       finalCheckList = finalCheckList.flat();
       const checkOrNot = finalCheckList.find(
         (element) => element === blackKingCurrentPosition
       );
   
       if (checkOrNot) {
         whoInCheck = "black";
       }
     }
   }
   
   function captureInTurn(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     return;
   }
   
   function checkForPawnPromotion(piece, id) {
     if (inTurn === "white") {
       if (
         piece?.piece_name?.toLowerCase()?.includes("pawn") &&
         id?.includes("8")
       ) {
         return true;
       } else {
         return false;
       }
     } else {
       if (
         piece?.piece_name?.toLowerCase()?.includes("pawn") &&
         id?.includes("1")
       ) {
         return true;
       } else {
         return false;
       }
     }
   }
   
   function callbackPawnPromotion(piece, id) {
     const realPiece = piece(id);
     const currentSquare = keySquareMapper[id];
     piece.current_position = id;
     currentSquare.piece = realPiece;
     const image = document.createElement("img");
     image.src = realPiece.img;
     image.classList.add("piece");
   
     const currentElement = document.getElementById(id);
     currentElement.innerHTML = "";
     currentElement.append(image);
   }
   
   // move element to square with id
   function moveElement(piece, id, castle) {
     const pawnIsPromoted = checkForPawnPromotion(piece, id);
   
     if (piece.piece_name.includes("KING") || piece.piece_name.includes("ROOK")) {
       piece.move = true;
   
       if (
         piece.piece_name.includes("KING") &&
         piece.piece_name.includes("BLACK")
       ) {
         if (id === "c8" || id === "g8") {
           let rook = keySquareMapper[id === "c8" ? "a8" : "h8"];
           moveElement(rook.piece, id === "c8" ? "d8" : "f8", true);
         }
       }
   
       if (
         piece.piece_name.includes("KING") &&
         piece.piece_name.includes("WHITE")
       ) {
         if (id === "c1" || id === "g1") {
           let rook = keySquareMapper[id === "c1" ? "a1" : "h1"];
           moveElement(rook.piece, id === "c1" ? "d1" : "f1", true);
         }
       }
     }
   
     const flatData = globalState.flat();
     flatData.forEach((el) => {
       if (el.id == piece.current_position) {
         delete el.piece;
       }
       if (el.id == id) {
         if (el.piece) {
           el.piece.current_position = null;
         }
         el.piece = piece;
       }
     });
     clearHightlight();
     const previousPiece = document.getElementById(piece.current_position);
     piece.current_position = null;
     previousPiece?.classList?.remove("highlightYellow");
     const currentPiece = document.getElementById(id);
     currentPiece.innerHTML = previousPiece?.innerHTML;
     if (previousPiece) previousPiece.innerHTML = "";
     piece.current_position = id;
     if (pawnIsPromoted) {
       pawnPromotion(inTurn, callbackPawnPromotion, id);
     }
     checkForCheck();
     // if(whoInCheck)
     // {
     // }
     // new HypotheticalBoard(globalState);
     if (!castle) {
       changeTurn();
     }
     // globalStateRender();
   }
   
   // current self-highlighted square state
   let selfHighlightState = null;
   
   // in move state or not
   let moveState = null;
   
   // local function that will clear highlight with state
   function clearHighlightLocal() {
     clearHightlight();
     hightlight_state = false;
   }
   
   // move piece from x-square to y-square
   function movePieceFromXToY(from, to) {
     to.piece = from.piece;
     from.piece = null;
     globalStateRender();
   }
   
   // white pawn event
   function whitePawnClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = null;
   
     // on initial position movement
     if (current_pos[1] == "2") {
       hightlightSquareIds = [
         `${current_pos[0]}${Number(current_pos[1]) + 1}`,
         `${current_pos[0]}${Number(current_pos[1]) + 2}`,
       ];
     } else {
       hightlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) + 1}`];
     }
   
     hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     // capture id logic
     const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
       Number(current_pos[1]) + 1
     }`;
     const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
       Number(current_pos[1]) + 1
     }`;
   
     let captureIds = [col1, col2];
     // captureIds = checkSquareCaptureId(captureIds);
   
     captureIds.forEach((element) => {
       checkPieceOfOpponentOnElement(element, "white");
     });
   
     globalStateRender();
   }
   
   // white bishop event
   function whiteBishopClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveBishopHighlightIds(current_pos);
     let temp = [];
   
     const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;
   
     let result = [];
     result.push(checkSquareCaptureId(bottomLeft));
     result.push(checkSquareCaptureId(topLeft));
     result.push(checkSquareCaptureId(bottomRight));
     result.push(checkSquareCaptureId(topRight));
   
     // insert into temp
     temp.push(bottomLeft);
     temp.push(topLeft);
     temp.push(bottomRight);
     temp.push(topRight);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("white")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "white")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   
   // black bishop event
   function blackBishopClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveBishopHighlightIds(current_pos);
     let temp = [];
   
     const { bottomLeft, topLeft, bottomRight, topRight } = hightlightSquareIds;
   
     let result = [];
     result.push(checkSquareCaptureId(bottomLeft));
     result.push(checkSquareCaptureId(topLeft));
     result.push(checkSquareCaptureId(bottomRight));
     result.push(checkSquareCaptureId(topRight));
   
     // insert into temp
     temp.push(bottomLeft);
     temp.push(topLeft);
     temp.push(bottomRight);
     temp.push(topRight);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("black")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "black")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   
   // black rook
   function blackRookClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveRookHighlightIds(current_pos);
     let temp = [];
   
     const { bottom, top, right, left } = hightlightSquareIds;
   
     let result = [];
     result.push(checkSquareCaptureId(bottom));
     result.push(checkSquareCaptureId(top));
     result.push(checkSquareCaptureId(right));
     result.push(checkSquareCaptureId(left));
   
     // insert into temp
     temp.push(bottom);
     temp.push(top);
     temp.push(right);
     temp.push(left);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("black")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "black")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   
   // white rook click
   function whiteRookClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveRookHighlightIds(current_pos);
     let temp = [];
   
     const { bottom, top, right, left } = hightlightSquareIds;
   
     let result = [];
     result.push(checkSquareCaptureId(bottom));
     result.push(checkSquareCaptureId(top));
     result.push(checkSquareCaptureId(right));
     result.push(checkSquareCaptureId(left));
   
     // insert into temp
     temp.push(bottom);
     temp.push(top);
     temp.push(right);
     temp.push(left);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("white")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "white")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   
   // handle knight click
   function whiteKnightClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveKnightHighlightIds(current_pos);
     // const { bottom, top, right, left } = hightlightSquareIds;
     // let temp = [];
   
     // let result = [];
     // result.push(checkSquareCaptureId(bottom));
     // result.push(checkSquareCaptureId(top));
     // result.push(checkSquareCaptureId(right));
     // result.push(checkSquareCaptureId(left));
   
     // // insert into temp
     // temp.push(bottom);
     // temp.push(top);
     // temp.push(right);
     // temp.push(left);
   
     // // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     // hightlightSquareIds = result.flat();
   
     // hightlightSquareIds.forEach((hightlight) => {
     //   const element = keySquareMapper[hightlight];
     //   element.highlight = true;
     // });
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     // for (let index = 0; index < temp.length; index++) {
     //   const arr = temp[index];
   
     //   for (let j = 0; j < arr.length; j++) {
     //     const element = arr[j];
   
     //     let checkPieceResult = checkWeatherPieceExistsOrNot(element);
     //     if (
     //       checkPieceResult &&
     //       checkPieceResult.piece &&
     //       checkPieceResult.piece.piece_name.toLowerCase().includes("white")
     //     ) {
     //       break;
     //     }
   
     //     if (checkPieceOfOpponentOnElement(element, "white")) {
     //       break;
     //     }
     //   }
     // }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     hightlightSquareIds.forEach((element) => {
       checkPieceOfOpponentOnElement(element, "white");
     });
   
     globalStateRender();
   }
   
   // handle knight click
   function blackKnightClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveKnightHighlightIds(current_pos);
     // const { bottom, top, right, left } = hightlightSquareIds;
     // console.log(hightlightSquareIds);
     // let temp = [];
   
     // let result = [];
     // result.push(checkSquareCaptureId(bottom));
     // result.push(checkSquareCaptureId(top));
     // result.push(checkSquareCaptureId(right));
     // result.push(checkSquareCaptureId(left));
   
     // // insert into temp
     // temp.push(bottom);
     // temp.push(top);
     // temp.push(right);
     // temp.push(left);
   
     // // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     // hightlightSquareIds = result.flat();
   
     // hightlightSquareIds.forEach((hightlight) => {
     //   const element = keySquareMapper[hightlight];
     //   element.highlight = true;
     // });
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     // for (let index = 0; index < temp.length; index++) {
     //   const arr = temp[index];
   
     //   for (let j = 0; j < arr.length; j++) {
     //     const element = arr[j];
   
     //     let checkPieceResult = checkWeatherPieceExistsOrNot(element);
     //     if (
     //       checkPieceResult &&
     //       checkPieceResult.piece &&
     //       checkPieceResult.piece.piece_name.toLowerCase().includes("white")
     //     ) {
     //       break;
     //     }
   
     //     if (checkPieceOfOpponentOnElement(element, "white")) {
     //       break;
     //     }
     //   }
     // }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     hightlightSquareIds.forEach((element) => {
       checkPieceOfOpponentOnElement(element, "black");
     });
   
     globalStateRender();
   }
   
   // white queen event
   function whiteQueenClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveQueenHighlightIds(current_pos);
     let temp = [];
   
     const {
       bottomLeft,
       topLeft,
       bottomRight,
       topRight,
       top,
       right,
       left,
       bottom,
     } = hightlightSquareIds;
   
     let result = [];
     result.push(checkSquareCaptureId(bottomLeft));
     result.push(checkSquareCaptureId(topLeft));
     result.push(checkSquareCaptureId(bottomRight));
     result.push(checkSquareCaptureId(topRight));
     result.push(checkSquareCaptureId(top));
     result.push(checkSquareCaptureId(right));
     result.push(checkSquareCaptureId(bottom));
     result.push(checkSquareCaptureId(left));
   
     // insert into temp
     temp.push(bottomLeft);
     temp.push(topLeft);
     temp.push(bottomRight);
     temp.push(topRight);
     temp.push(top);
     temp.push(right);
     temp.push(bottom);
     temp.push(left);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("white")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "white")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   
   // white king event
   function whiteKingClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveKingHighlightIds(current_pos);
     let temp = [];
   
     const {
       bottomLeft,
       topLeft,
       bottomRight,
       topRight,
       top,
       right,
       left,
       bottom,
     } = hightlightSquareIds;
   
     let result = [];
   
     if (!piece.move) {
       const rook1 = globalPiece.white_rook_1;
       const rook2 = globalPiece.white_rook_2;
       if (!rook1.move) {
         const b1 = keySquareMapper["b1"];
         const c1 = keySquareMapper["c1"];
         const d1 = keySquareMapper["d1"];
         if (!b1.piece && !c1.piece && !d1.piece) {
           result.push("c1");
         }
       }
       if (!rook2.move) {
         const f1 = keySquareMapper["f1"];
         const g1 = keySquareMapper["g1"];
         if (!f1.piece && !g1.piece) {
           result.push("g1");
         }
       }
     }
   
     result.push(checkSquareCaptureId(bottomLeft));
     result.push(checkSquareCaptureId(topLeft));
     result.push(checkSquareCaptureId(bottomRight));
     result.push(checkSquareCaptureId(topRight));
     result.push(checkSquareCaptureId(top));
     result.push(checkSquareCaptureId(right));
     result.push(checkSquareCaptureId(bottom));
     result.push(checkSquareCaptureId(left));
   
     // insert into temp
     temp.push(bottomLeft);
     temp.push(topLeft);
     temp.push(bottomRight);
     temp.push(topRight);
     temp.push(top);
     temp.push(right);
     temp.push(bottom);
     temp.push(left);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("white")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "white")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   // white king event
   function blackKingClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
   
     let hightlightSquareIds = giveKingHighlightIds(current_pos);
     let temp = [];
   
     const {
       bottomLeft,
       topLeft,
       bottomRight,
       topRight,
       top,
       right,
       left,
       bottom,
     } = hightlightSquareIds;
   
     let result = [];
   
     if (!piece.move) {
       const rook1 = globalPiece.black_rook_1;
       const rook2 = globalPiece.black_rook_2;
       if (!rook1.move) {
         const b1 = keySquareMapper["b8"];
         const c1 = keySquareMapper["c8"];
         const d1 = keySquareMapper["d8"];
         if (!b1.piece && !c1.piece && !d1.piece) {
           result.push("c8");
         }
       }
       if (!rook2.move) {
         const f1 = keySquareMapper["f8"];
         const g1 = keySquareMapper["g8"];
         if (!f1.piece && !g1.piece) {
           result.push("g8");
         }
       }
     }
   
     result.push(checkSquareCaptureId(bottomLeft));
     result.push(checkSquareCaptureId(topLeft));
     result.push(checkSquareCaptureId(bottomRight));
     result.push(checkSquareCaptureId(topRight));
     result.push(checkSquareCaptureId(top));
     result.push(checkSquareCaptureId(right));
     result.push(checkSquareCaptureId(bottom));
     result.push(checkSquareCaptureId(left));
   
     // insert into temp
     temp.push(bottomLeft);
     temp.push(topLeft);
     temp.push(bottomRight);
     temp.push(topRight);
     temp.push(top);
     temp.push(right);
     temp.push(bottom);
     temp.push(left);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("black")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "black")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   
   // black queen event
   function blackQueenClick(square) {
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     // clear all highlights
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = giveQueenHighlightIds(current_pos);
     let temp = [];
   
     const {
       bottomLeft,
       topLeft,
       bottomRight,
       topRight,
       top,
       right,
       left,
       bottom,
     } = hightlightSquareIds;
   
     let result = [];
     result.push(checkSquareCaptureId(bottomLeft));
     result.push(checkSquareCaptureId(topLeft));
     result.push(checkSquareCaptureId(bottomRight));
     result.push(checkSquareCaptureId(topRight));
     result.push(checkSquareCaptureId(top));
     result.push(checkSquareCaptureId(right));
     result.push(checkSquareCaptureId(bottom));
     result.push(checkSquareCaptureId(left));
   
     // insert into temp
     temp.push(bottomLeft);
     temp.push(topLeft);
     temp.push(bottomRight);
     temp.push(topRight);
     temp.push(top);
     temp.push(right);
     temp.push(bottom);
     temp.push(left);
   
     // hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
     hightlightSquareIds = result.flat();
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     let captureIds = [];
   
     for (let index = 0; index < temp.length; index++) {
       const arr = temp[index];
   
       for (let j = 0; j < arr.length; j++) {
         const element = arr[j];
   
         let checkPieceResult = checkWeatherPieceExistsOrNot(element);
         if (
           checkPieceResult &&
           checkPieceResult.piece &&
           checkPieceResult.piece.piece_name.toLowerCase().includes("black")
         ) {
           break;
         }
   
         if (checkPieceOfOpponentOnElement(element, "black")) {
           break;
         }
       }
     }
   
     // let captureIds = [col1, col2];
     // console.log(captureIds);
     // // captureIds = checkSquareCaptureId(captureIds);
   
     // captureIds.forEach((element) => {
     //   checkPieceOfOpponentOnElement(element, "white");
     // });
   
     globalStateRender();
   }
   
   // black pawn function
   function blackPawnClick(square) {
     // clear board for any previous highlight
   
     const piece = square.piece;
   
     if (piece == selfHighlightState) {
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     if (square.captureHighlight) {
       // movePieceFromXToY();
       moveElement(selfHighlightState, piece.current_position);
       clearPreviousSelfHighlight(selfHighlightState);
       clearHighlightLocal();
       return;
     }
   
     clearPreviousSelfHighlight(selfHighlightState);
     clearHighlightLocal();
   
     // highlighting logic
     selfHighlight(piece);
     hightlight_state = true;
     selfHighlightState = piece;
   
     // add piece as move state
     moveState = piece;
   
     const current_pos = piece.current_position;
     const flatArray = globalState.flat();
   
     let hightlightSquareIds = null;
   
     // on initial position movement
     if (current_pos[1] == "7") {
       hightlightSquareIds = [
         `${current_pos[0]}${Number(current_pos[1]) - 1}`,
         `${current_pos[0]}${Number(current_pos[1]) - 2}`,
       ];
     } else {
       hightlightSquareIds = [`${current_pos[0]}${Number(current_pos[1]) - 1}`];
     }
   
     hightlightSquareIds = checkSquareCaptureId(hightlightSquareIds);
   
     hightlightSquareIds.forEach((hightlight) => {
       const element = keySquareMapper[hightlight];
       element.highlight = true;
     });
   
     // capture logic id
     const col1 = `${String.fromCharCode(current_pos[0].charCodeAt(0) - 1)}${
       Number(current_pos[1]) - 1
     }`;
     const col2 = `${String.fromCharCode(current_pos[0].charCodeAt(0) + 1)}${
       Number(current_pos[1]) - 1
     }`;
   
     let captureIds = [col1, col2];
     // captureIds = checkSquareCaptureId(captureIds);
   
     captureIds.forEach((element) => {
       checkPieceOfOpponentOnElement(element, "black");
     });
   
     globalStateRender();
   }
   
   function clearPreviousSelfHighlight(piece) {
     if (piece) {
       document
         .getElementById(piece.current_position)
         .classList.remove("highlightYellow");
       // console.log(piece);
       // selfHighlight = false;
       selfHighlightState = null;
     }
   }
   
   // // black pawn event
   
   function GlobalEvent() {
     ROOT_DIV.addEventListener("click", function (event) {
       if (event.target.localName === "img") {
         const clickId = event.target.parentNode.id;
   
         const square = keySquareMapper[clickId];
   
         if (
           (square.piece.piece_name.includes("WHITE") && inTurn === "black") ||
           (square.piece.piece_name.includes("BLACK") && inTurn === "white")
         ) {
           captureInTurn(square);
           return;
         }
   
         if (square.piece.piece_name == "WHITE_PAWN") {
           if (inTurn == "white") whitePawnClick(square);
         } else if (square.piece.piece_name == "BLACK_PAWN") {
           if (inTurn == "black") blackPawnClick(square);
         } else if (square.piece.piece_name == "WHITE_BISHOP") {
           if (inTurn == "white") whiteBishopClick(square);
         } else if (square.piece.piece_name == "BLACK_BISHOP") {
           if (inTurn == "black") blackBishopClick(square);
         } else if (square.piece.piece_name == "BLACK_ROOK") {
           if (inTurn == "black") blackRookClick(square);
         } else if (square.piece.piece_name == "WHITE_ROOK") {
           if (inTurn == "white") whiteRookClick(square);
         } else if (square.piece.piece_name == "WHITE_KNIGHT") {
           if (inTurn == "white") whiteKnightClick(square);
         } else if (square.piece.piece_name == "BLACK_KNIGHT") {
           if (inTurn == "black") blackKnightClick(square);
         } else if (square.piece.piece_name == "WHITE_QUEEN") {
           if (inTurn == "white") whiteQueenClick(square);
         } else if (square.piece.piece_name == "BLACK_QUEEN") {
           if (inTurn == "black") blackQueenClick(square);
         } else if (square.piece.piece_name == "WHITE_KING") {
           if (inTurn == "white") whiteKingClick(square);
         } else if (square.piece.piece_name == "BLACK_KING") {
           if (inTurn == "black") blackKingClick(square);
         }
       } else {
         const childElementsOfclickedEl = Array.from(event.target.childNodes);
   
         if (
           childElementsOfclickedEl.length == 1 ||
           event.target.localName == "span"
         ) {
           if (event.target.localName == "span") {
             clearPreviousSelfHighlight(selfHighlightState);
             const id = event.target.parentNode.id;
             moveElement(moveState, id);
             moveState = null;
           } else {
             clearPreviousSelfHighlight(selfHighlightState);
             const id = event.target.id;
             moveElement(moveState, id);
             moveState = null;
           }
         } else {
           // clear highlights
           clearHighlightLocal();
           clearPreviousSelfHighlight(selfHighlightState);
         }
       }
     });
   }

   class HypotheticalBoard {
    constructor(data){
        if(!data){
            throw new Error('Please Provide Some Data');
        }
        this.state = JSON.parse(JSON.stringify(data));
        console.log(this);
    }

    move(){
        
    }
}

// function globalStateRender (this function is usefull to render pieces from globalStateData) => use when updating globalState
function globalStateRender() {
    globalState.forEach((row) => {
      row.forEach((element) => {
        if (element.highlight) {
          const hightlightSpan = document.createElement("span");
          hightlightSpan.classList.add("highlight");
          document.getElementById(element.id).appendChild(hightlightSpan);
          // } else if (element.highlight === null) {
        } else {
          const el = document.getElementById(element.id);
          const highlights = Array.from(el.getElementsByTagName("span"));
          highlights.forEach((element) => {
            el.removeChild(element);
          });
          // document.getElementById(element.id).innerHTML = "";
        }
      });
    });
  }
  
  
  function selfHighlight(piece) {
    document
      .getElementById(piece.current_position)
      .classList.add("highlightYellow");
  }
  
  // use when you want to render pieces on board
  function pieceRender(data) {
    data.forEach((row) => {
      row.forEach((square) => {
        // if square has piece
        if (square.piece) {
          const squareEl = document.getElementById(square.id);
  
          // create piece
          const piece = document.createElement("img");
          piece.src = square.piece.img;
          piece.classList.add("piece");
  
          // insert piece into square element
          squareEl.appendChild(piece);
        }
      });
    });
  }
  
  // use when you want to render board for first time when game start
function initGameRender(data) {
  data.forEach((element) => {
      const rowEl = document.createElement("div");
      element.forEach((square) => {
          const squareDiv = document.createElement("div");
          squareDiv.id = square.id;
          squareDiv.classList.add(square.color, "square");

          // render black pawn
          if (square.id[1] == 7) {
              square.piece = blackPawn(square.id);
              globalPiece.black_pawn = square.piece;
          }

          // render black rook
          if (square.id == "h8" || square.id == "a8") {
              square.piece = blackRook(square.id);
              if (globalPiece.black_rook_1) {
                  globalPiece.black_rook_2 = square.piece;
              } else {
                  globalPiece.black_rook_1 = square.piece;
              }
          }

          // render black knight
          if (square.id == "b8" || square.id == "g8") {
              square.piece = blackKnight(square.id);
              if (globalPiece.black_knight_1) {
                  globalPiece.black_knight_2 = square.piece;
              } else {
                  globalPiece.black_knight_1 = square.piece;
              }
          }
          // render black bishop
          if (square.id == "c8" || square.id == "f8") {
              square.piece = blackBishop(square.id);
              if (globalPiece.black_bishop_1) {
                  globalPiece.black_bishop_2 = square.piece;
              } else {
                  globalPiece.black_bishop_1 = square.piece;
              }
          }
          // render black queen
          if (square.id == "d8") {
              square.piece = blackQueen(square.id);
              globalPiece.black_queen = square.piece;
          }
          // render black king
          if (square.id == "e8") {
              square.piece = blackKing(square.id);
              globalPiece.black_king = square.piece;
          }

          // render white pawn
          if (square.id[1] == 2) {
              square.piece = whitePawn(square.id);
              globalPiece.white_pawn = square.piece;
          }
          // render white queen
          if (square.id == "d1") {
              square.piece = whiteQueen(square.id);
              globalPiece.white_queen = square.piece;
          }

          // render white king
          if (square.id == "e1") {
              square.piece = whiteKing(square.id);
              globalPiece.white_king = square.piece;
          }

          // render white rook
          if (square.id == "h1" || square.id == "a1") {
              square.piece = whiteRook(square.id);
              if (globalPiece.white_rook_1) {
                  globalPiece.white_rook_2 = square.piece;
              } else {
                  globalPiece.white_rook_1 = square.piece;
              }
          }

          // render white knight
          if (square.id == "b1" || square.id == "g1") {
              square.piece = whiteKnight(square.id);
              if (globalPiece.white_knight_1) {
                  globalPiece.white_knight_2 = square.piece;
              } else {
                  globalPiece.white_knight_1 = square.piece;
              }
          }

          // render white bishop
          if (square.id == "c1" || square.id == "f1") {
              square.piece = whiteBishop(square.id);
              if (globalPiece.white_bishop_1) {
                  globalPiece.white_bishop_2 = square.piece;
              } else {
                  globalPiece.white_bishop_1 = square.piece;
              }
          }

          rowEl.appendChild(squareDiv);
      });
      rowEl.classList.add("squareRow");
      ROOT_DIV.appendChild(rowEl);
  });

  pieceRender(data);
}
  
  // render hightlight circle
  function renderHighlight(squareId) {
    const hightlightSpan = document.createElement("span");
    hightlightSpan.classList.add("highlight");
    document.getElementById(squareId).appendChild(hightlightSpan);
  }
  
  // clear all highlights from the board
  function clearHightlight() {
    const flatData = globalState.flat();
  
    flatData.forEach((el) => {
      if (el.captureHighlight) {
        document.getElementById(el.id).classList.remove("captureColor");
        el.captureHighlight = false;
      }
  
      if (el.highlight) {
        el.highlight = null;
      }
  
      globalStateRender();
    });
  }

  class ModalCreator {
    constructor(body) {
      if (!body) {
        throw new Error("Please pass the body");
      }
  
      this.open = false;
      this.body = body;
    }
  
    show() {
      this.open = true;
      document.body.appendChild(this.body);
      document.getElementById("root").classList.add("blur");
    }
  
    hide() {
      this.open = false;
      document.body.removeChild(this.body);
      document.getElementById("root").classList.remove("blur");
    }
  }
  
  function pawnPromotion(color, callback, id) {
    const rook = document.createElement("img");
    rook.onclick = rookCallback;
    rook.src = `Assets/images/pieces/${color}/rook.png`;
  
    const knight = document.createElement("img");
    knight.onclick = knightCallback;
    knight.src = `Assets/images/pieces/${color}/knight.png`;
  
    const bishop = document.createElement("img");
    bishop.onclick = bishopCallback;
    bishop.src = `Assets/images/pieces/${color}/bishop.png`;
  
    const queen = document.createElement("img");
    queen.onclick = queenCallback;
    queen.src = `Assets/images/pieces/${color}/queen.png`;
  
    const imageContainer = document.createElement("div");
    imageContainer.appendChild(rook);
    imageContainer.appendChild(knight);
    imageContainer.appendChild(bishop);
    imageContainer.appendChild(queen);
  
    const msg = document.createElement("p");
    msg.textContent = "Your Pawn has been promoted 🥳";
  
    const finalContainer = document.createElement("div");
    finalContainer.appendChild(msg);
    finalContainer.appendChild(imageContainer);
    finalContainer.classList.add("modal");
  
    const modal = new ModalCreator(finalContainer);
    modal.show();
  
    // callbacks
    function rookCallback() {
      if (color == "white") {
        callback(whiteRook, id);
      } else {
        callback(blackRook, id);
      }
      modal.hide();
    }
  
    function knightCallback() {
      if (color == "white") {
        callback(whiteKnight, id);
      } else {
        callback(blackKnight, id);
      }
      modal.hide();
    }
  
    function bishopCallback() {
      if (color == "white") {
        callback(whiteBishop, id);
      } else {
        callback(blackBishop, id);
      }
      modal.hide();
    }
  
    function queenCallback() {
      if (color == "white") {
        callback(whiteQueen, id);
      } else {
        callback(blackQueen, id);
      }
      modal.hide();
    }
  }

  // black pieces
function blackPawn(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/black/pawn.png",
      piece_name: "BLACK_PAWN",
    };
  }
  function blackBishop(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/black/bishop.png",
      piece_name: "BLACK_BISHOP",
    };
  }
  function blackKnight(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/black/knight.png",
      piece_name: "BLACK_KNIGHT",
    };
  }
  function blackKing(current_position) {
    return {
      move: false,
      current_position,
      img: "Assets/images/pieces/black/king.png",
      piece_name: "BLACK_KING",
    };
  }
  function blackQueen(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/black/queen.png",
      piece_name: "BLACK_QUEEN",
    };
  }
  function blackRook(current_position) {
    return {
      move: false,
      current_position,
      img: "Assets/images/pieces/black/rook.png",
      piece_name: "BLACK_ROOK",
    };
  }
  
  // white pieces
  function whitePawn(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/white/pawn.png",
      piece_name: "WHITE_PAWN",
    };
  }
  function whiteRook(current_position) {
    return {
      move: false,
      current_position,
      img: "Assets/images/pieces/white/rook.png",
      piece_name: "WHITE_ROOK",
    };
  }
  function whiteKnight(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/white/knight.png",
      piece_name: "WHITE_KNIGHT",
    };
  }
  function whiteBishop(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/white/bishop.png",
      piece_name: "WHITE_BISHOP",
    };
  }
  function whiteQueen(current_position) {
    return {
      current_position,
      img: "Assets/images/pieces/white/queen.png",
      piece_name: "WHITE_QUEEN",
    };
  }
  function whiteKing(current_position) {
    return {
      move: false,
      current_position,
      img: "Assets/images/pieces/white/king.png",
      piece_name: "WHITE_KING",
    };
  }