import React from 'react';
import './App.css';


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      seconds:0,
      size:3,
      grid:[],
      human:'X',
      agent:'O',
      current_move:'human',
      winner:''
    }
    this.current_move = 'human'
    this.waiting = false;
  }
  componentDidMount(){
    var grid = [];
    for(var i=0;i<this.state.size;i++){
      var r = []
      for(var j = 0;j<this.state.size;j++){
        r.push('');
      }
      grid.push(r);
    }
    this.setState({grid:grid});
  }
  change_turn(){
    if(this.current_move=='human'){
      this.current_move = 'agent'
      var besti,bestj;
      var bsc = -Infinity;
      var board = [...this.state.grid];
      // console.log(board)
      for(var i=0;i<this.state.size;i++){
        for(var j=0;j<this.state.size;j++){
          if(board[i][j]==''){
            board[i][j] = 'O';
            let s = this.minimax([...board],0,false,-Infinity,Infinity);
            board[i][j] = '';
            if(s>bsc){
              bsc = s;
              besti = i;
              bestj = j;
            }
          }
        }
      }
      console.log(besti,bestj,this.current_move)
      this.waiting = false;
      this.play_move(besti,bestj)
    }else{
      this.current_move = 'human'
    }
  }

  
  minimax(board,depth,isMaximizing,alpha,beta){
    // console.log(board)
    // if(depth>3) return 0;
    let s = this.check_winner(board);
    if(s){
      // console.log(s)
      if(s=='tie') return 0;
      else if(s=='agent') return 10 - depth;
      else if(s=='human') return -10 + depth;
    }else{
      if(isMaximizing){
        var bestscore = -Infinity;
        for(var i=0;i<this.state.size;i++){
          for(var j=0;j<this.state.size;j++){
            if(board[i][j]==''){
              board[i][j] = 'O';
              let score = this.minimax(board,depth+1,false,alpha,beta)
              if(score>bestscore){
                bestscore = score;
              }
              if(alpha>bestscore){
                alpha = bestscore
              }
              board[i][j] = '';
              if(beta<=alpha){
                break;
              }
            }
          }
        }
        return bestscore;
      }else{
        var bestmin = Infinity;
        for(var i=0;i<this.state.size;i++){
          for(var j=0;j<this.state.size;j++){
            if(board[i][j]==''){
              board[i][j] = 'X';
              let score = this.minimax(board,depth+1,true,alpha,beta)
              if(score<bestmin){
                bestmin = score;
              }
              if(beta<bestmin){
                beta = bestmin;
              }
              board[i][j] = '';
              if(beta<=alpha) break;
            }
          }
        }
        return bestmin;
      }
    }
  }

  reset_game(){
    var grid = [];
    for(var i=0;i<this.state.size;i++){
      var r = []
      for(var j = 0;j<this.state.size;j++){
        r.push('');
      }
      grid.push(r);
    }
    this.current_move = 'human'
    this.waiting = false;
    this.setState({grid:grid,current_move:'human',winner:''});
  }
  play_move(row,col){
    if(this.state.grid[row][col]=='' && this.state.winner=='' && !this.waiting){
      var st = [...this.state.grid];
      st[row][col] = this.state[this.current_move];
      this.setState({grid:st});
      this.waiting = true;
      let s = this.check_winner(st);
      if(s){
        this.setState({winner:s})
      }else{
        this.change_turn();
        this.waiting = false;
      }


    }
  }
  check_winner(grid){
    var found = false;
    for(var i=0;i<this.state.size;i++){
      for(var j = 0;j<this.state.size-1;j++){
        if(grid[i][j] == grid[i][j+1]){
          if(j==this.state.size-2){
            if(grid[i][j] == 'X'){
              found = true;
              return 'human'
            }else if(grid[i][j]=='O'){
              
              found = true;
              return 'agent';
            }
          }
        }else{
          break;
        }
      }

      for(var j = 0;j<this.state.size-1;j++){
        if(grid[j][i] == grid[j+1][i]){
          if(j==this.state.size-2){
            if(grid[j][i] == 'X'){
              found = true;
              return 'human'
            }else if(grid[j][i]=='O'){
              found = true;
              return 'agent';
            }
          }
        }else{
          break;
        }
      }
    }
    for(var i=0;i<this.state.size-1;i++){
      if(grid[i][i] == grid[i+1][i+1]){
        if(i == this.state.size-2){
          if(grid[i][i] == 'X'){
            found = true;
            return 'human'
          }else if(grid[i][i]=='O'){
            found = true;
            return 'agent';
          }
        }
      }else{
        break;
      }
    }

    for(var i=0;i<this.state.size-1;i++){
      if(grid[i][this.state.size-i-1]==grid[i+1][this.state.size-i-2]){
        if(i == this.state.size-2){
          if(grid[i][this.state.size-i-1] == 'X'){
            found = true;
            return 'human'
          }else if(grid[i][this.state.size-i-1]=='O'){
            
            found = true;
            return 'agent';
          }
        }
      }else{
        break;
      }
    }
    for(var i=0;i<this.state.size;i++){
      for(var j=0;j<this.state.size;j++){
        if(grid[i][j]==''){
          return;
        }
      }
    }
    return 'tie';
  }
  render(){
    return(
      <div className="home">
        
        <div className="board">
          {
            this.state.grid.map((row,i)=>{
              return (
                <div className="row">
                    {
                      row.map((col,j)=>{
                        return (
                          <div className="cell" onClick={()=>this.play_move(i,j)}>
                            {col}
                          </div>
                        )
                      })
                    }
                </div>
              )

            })
          }
        </div>
        <div className="controls">
          <span>Current Turn:{this.current_move}</span>
          &nbsp; &nbsp;
          <button onClick={()=>this.reset_game()}>Reset Game</button>
        </div>
        {
          this.state.winner!='' && this.state.winner!='tie' && <div style={{color:'white'}}>
          {this.state.winner} won!
          </div>
        }
        {
          this.state.winner=='tie' && <div style={{color:'white'}}>Tie!</div>
        }
      </div>
    )
  }
}