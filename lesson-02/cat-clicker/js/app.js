    var model = {
        currentItem: null,        
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
            
            if(this.currentItem == null){
                this.currentItem = this.getItemByIndex(0)
            }
        },
        getAllItems: function(){
            return JSON.parse(localStorage.items)
        },
        getItemByIndex: function(index){
            return this.getAllItems()[index]
        },

        getItemById: function(itemId){
            return this.getAllItems().filter(item => item.id == itemId)[0]
        }, 
        updateItem: function(item){
            let itemsChanged = this.getAllItems()
            itemsChanged.map(iItem =>{
                if(iItem.id == item.id){
                    iItem.catName = item.catName
                    iItem.pictureFileName = item.pictureFileName
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
        adminAreaView.init()
    },

    getCurrentItem: function(){
        return model.currentItem
    },

    setCurrentItem: function(item) {
        model.currentItem = item;
    },

    getItems: function(){
        return model.getAllItems()
    },
    getItem: function(itemId){
        return model.getItemById(itemId)
    },
    addItemClickCount: function(){
        model.currentItem.clickCount++
        model.updateItem(model.currentItem)
        itemView.render()
    },

    changeCurrentItem: function(newItem){
        let item = {}
        newItem.forEach(e => {
            item[e.name] = e.value
        })
        item.pictureFileName = model.currentItem.pictureFileName
        item.id = model.currentItem.id
        this.updateCurrentItem(item)
    },

    updateCurrentItem: function(newItem){
        model.currentItem = newItem
        model.updateItem(model.currentItem)
        itemsView.render()
        itemView.render()        
    }
}

var itemsView = {

    init: function(){
        this.items = $('#items')
        this.render()
    },

    render: function(){      
        this.items.empty()
        octopus.getItems().forEach(item => {
            let itemLi = document.createElement("li");
            itemLi.innerText = item.catName;
            itemLi.classList.add('item')
            itemLi.addEventListener('click', (function(cat){
                return function () {
                    adminAreaView.render()
                    octopus.setCurrentItem(cat)
                    itemView.render()
                }
            })(item))
            this.items.append(itemLi);
        });
    }
}

var itemView = {    

    init: function(){
        this.catName = $('#catName')
        this.clickCount = $('#clickCount')
        this.catPicture = $('#catPicture')
        this.catPicture.on('click', octopus.addItemClickCount)    
        this.render()
    },

    render: function(){
        let cat = octopus.getCurrentItem()                 
        this.catName.text(cat.catName)
        this.clickCount.text(cat.clickCount)
        this.catPicture.attr('src' , `images/${cat.pictureFileName}`)
    }
}

var adminAreaView = {

    init: function(){
        this.adminForm = $('.box-admin-form form')
        this.adminForm.on('submit', this.submitNewData)
        this.adminButton = $('#btn-admin')        
        this.adminButton.on('click',this.render.bind(this))     
    },

    render: function(event){
        const adminArea = $('.box-admin-form')                 
        if(event && adminArea.css('display') == 'none'){
            adminArea.css('display','inline-block')
            this.adminForm[0].reset()
            this.adminForm.find(':input[name=pictureFileName]')
                .val(octopus.getCurrentItem().pictureFileName)
        }else{
            adminArea.css('display','none')
        }
    },

    submitNewData : function(event){
        event.preventDefault()
        octopus.changeCurrentItem($(this).serializeArray())
    }
}

octopus.init()