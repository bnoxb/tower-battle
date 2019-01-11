<div class="container wrapper">
<div class="row">
    <div class="col-2 data-bar">
        
        <button id="next-level" disabled='true'>Go to next level</button>
        <div id="current-level">Level: 1</div>
         <div id="score-board">Gold: 0</div>
    </div>
    <div class="col-3">
         <div class="progress">
             <div class="progress-bar research-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                 Research: none
             </div>
         </div>
    </div>
    <div class="col-7">
         <div class="btn-group dropleft">
             <button type="button" class="btn btn-secondary btn-block dropdown-toggle upgrade" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 Upgrade Swordsman
             </button>
             <div class="dropdown-menu">
                 <!-- Dropdown menu links -->
                 <button type="button" class="btn upgrade sword-up" id="swordsman-hp-up">Upgrade Swordsman Hitpoints 5g</button>
                 <button type="button" class="btn upgrade sword-up" id="swordsman-defense-up">Upgrade Swordsman Defense 5g</button>
                 <button type="button" class="btn upgrade sword-up" id="swordsman-damage-up">Upgrade Swordsman Damage 5g</button>
                 <button type="button" class="btn upgrade sword-up" id="swordsman-attack-speed-up">Upgrade Swordsman Attack Speed 20g</button>
             </div>
         </div>
         <div class="btn-group dropleft">
                 <button type="button" class="btn btn-secondary btn-block dropdown-toggle upgrade" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                     Upgrade Archer
                 </button>
                 <div class="dropdown-menu">
                     <!-- Dropdown menu links -->
                     <button type="button" class="btn upgrade archer-up" id="archer-hp-up">Upgrade Archer Hitpoints 5g</button>
                     <button type="button" class="btn upgrade archer-up" id="archer-defense-up">Upgrade Archer Defense 5g</button>
                     <button type="button" class="btn upgrade archer-up" id="archer-damage-up">Upgrade Archer Damage 5g</button>
                     <button type="button" class="btn upgrade archer-up" id="archer-attack-speed-up">Upgrade Archer Attack Speed 20g</button>
                 </div>
         </div>
         <div class="btn-group dropleft">
                 <button type="button" class="btn btn-secondary btn-block dropdown-toggle upgrade" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                     Upgrade Defender
                 </button>
                 <div class="dropdown-menu">
                     <!-- Dropdown menu links -->
                     <button type="button" class="btn upgrade defender-up" id="defender-hp-up">Upgrade Defender Hitpoints 5g</button>
                     <button type="button" class="btn upgrade defender-up" id="defender-defense-up">Upgrade Defender Defense 5g</button>
                     <button type="button" class="btn upgrade defender-up" id="defender-damage-up">Upgrade Defender Damage 5g</button>
                     <button type="button" class="btn upgrade defender-up" id="defender-move-speed-up">Upgrade Defender Move Speed 20g</button>
                 </div>
         </div>
    </div>
</div> 
</div>
</div>
<div class='container game-board '></div>
<div class="container">
 <div class="row">
     <div class="col-6">
         <button type="button" class="btn btn-primary" id="make-sword">Make Swordsman</button>
         <button type="button" class="btn btn-primary" id="make-archer">Make Archer</button>
         <button type="button" class="btn btn-primary" id="make-defender">Make Defender</button>
     </div>
 </div>
</div>