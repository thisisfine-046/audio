import React from 'react'

export default function TopTodayv2({track }) {
    return (
        <div>
  
            <div class="card-title">
                      <div class="overlayer">
                          <i class="material-icons" onclick="myFunction()">play_circle</i>
                          <i class="material-icons">favorite</i>
                      </div>
  
                      <div class="card">
                          <h1>{track }</h1>
                      </div>
                      
              </div>
        </div>
    );
}
