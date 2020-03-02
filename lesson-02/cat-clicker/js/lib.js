    var model = {
        init: function(){
            localStorage.items = JSON.stringify([
                {
                    id: 1,
                    catName: "Cat 1",
                    clickCount: 0,
                    pictureFileName: 'cat1.jpg'
                },
                {
                    id: 2,
                    catName: "Cat 2",
                    clickCount: 0,
                    pictureFileName: 'cat2.jpg'
                },
                {
                    id: 3,
                    catName: "Cat 3",
                    clickCount: 0,
                    pictureFileName: 'cat3.jpg'
                }]
            )            
        },
        getAllItems: function(){
            return JSON.parse(localStorage.items)
        },
        getItemById: function(itemId){
            return this.getAllItems().filter(item => item.id == itemId)[0]
        }, 
        updateItemById: function(item){
            let itemsChanged = this.getAllItems()
            itemsChanged.map(iItem =>{
                if(iItem.id == item.id){
                    iItem.clickCount = item.clickCount
                }
            })
            localStorage.items =  JSON.stringify(itemsChanged)           
        }
    }

var octopus = {
    init: function() {
        model.init()
        itemsView.init()
        itemView.init()
    },
    getItems: function(){
        return model.getAllItems()
    },
    getItem: function(itemId){
        return model.getItemById(itemId)
    },
    addItemClickCount: function(item){
        item.clickCount = parseInt(item.clickCount) + 1
        model.updateItemById(item)
        itemView.render(item.id)
    }
}

var itemsView = {

    init: function(){
        this.items = $('#items')
        this.render()
    },

    render: function(){      
        octopus.getItems().forEach(item => {
            let itemLi = document.createElement("li");
            itemLi.innerText = item.catName;
            itemLi.classList.add('item')
            itemLi.addEventListener('click', function(){
                itemView.render(item.id)
            })
            this.items.append(itemLi);
        });
    }
}

var itemView = {    

    init: function(){
        this.catName = $('#catName')
        this.clickCount = $('#clickCount')
        this.catPicture = $('#catPicture')
        this.render()
    },

    render: function(catId){
        var listener;
        if(catId){
            let cat = octopus.getItem(catId)                       
            this.catName.text(cat.catName)
            this.clickCount.text(cat.clickCount)
            this.catPicture.attr('src' , `images/${cat.pictureFileName}`)
            this.catPicture.off('click', listener)
            listener = function(){
                octopus.addItemClickCount(cat)
            }
            this.catPicture.on('click', listener)                                 
        }else{
            this.catName.text('')
            this.clickCount.text()
        }
    }
}

octopus.init()