var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,ReadState;
function preload()
{
dogimg = loadImage("images/dogImg.png")
dogimg1 = loadImage("images/dogImg1.png")
bedimg = loadImage("images/Bed Room.png")
gardenimg = loadImage("images/Garden.png")
washroomimg = loadImage("images/Wash Room.png")
}

function setup() {
  database = firebase.database();
  createCanvas(800, 700);

  foodObj = new Food();

  foodStock=database.ref('Food');
foodStock.on("value",readStock);

fedTime = database.ref('FeedTime')
fedTime.on("value",function(data){
  lastFed = data.val()
})
  
readState = database.ref('gameState')
readState.on("value",function(data){
  gameState = data.val()
})
dog = createSprite(250,300,150)
dog.addImage(dogimg)
dog.scale = 0.15

feed = createButton("Feed The Dog")
feed.position(700,95)
feed.mousePressed(feedDog);

addFood = createButton("Add Food")
addFood.position(800,95);
addFood.mousePressed(addFoods)



}


function draw() {  
currentTime = hour();
if(currentTime == (lastFed+1)){
  update("Playing")
  foodObj.garden();
} else if(currentTime == (lastFed+2)){
  update("Sleeping")
  foodObj.bedroom();
} else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
  update("Bathing")
  foodObj.washroom();
} else{
  update("Hungry")
  foodObj.display();
}

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(dogimg);
}


  drawSprites();
  

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function feedDog(){
  dog.addImage(dogimg1);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour(),
  gameState:"Hungry"  
  })
}

function addFoods(){
  foodS++
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
database.ref('/').update({
  gameState:state
})

}


