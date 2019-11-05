let UIController = (function () {

    let domItems = {

        addBtn: document.querySelector('.add__btn'),
        deleteBtnString: 'item__delete--btn',
        addValueInput: document.querySelector('.add__value'),
        addDescriptionInput: document.querySelector('.add__description'),
        type: document.querySelector('.add__type'),
        income: document.querySelector('.income__list'),
        expense: document.querySelector('.expenses__list'),
        budgetLable: document.querySelector('.budget__value'),
        incLable: document.querySelector('.budget__income--value'),
        expLable: document.querySelector('.budget__expenses--value'),
        percentageLable: document.querySelector('.budget__expenses--percentage'),
        container: document.querySelector('.container'),
        itemPercentagesString: '.item__percentage',
        dateLable: document.querySelector('.budget__title--month')

    };

    let formatNum = function (num, type) {
        let splitNum;
        num = Math.abs(num);
        num = num.toFixed(2);
        splitNum = num.split('.');
        dec = splitNum[1];
        int = splitNum[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        return `${(type === 'exp' ? '-' : '+')} ${int}.${dec}`;
    };

    return {
        domItems: domItems,

        addListItem: function (obj, type) {
            let htmlString, itemDiv;

            if (type === 'inc') {

                itemDiv = domItems.income;

                htmlString = `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNum(obj.value, type)}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;

            } else if (type === 'exp') {
                itemDiv = domItems.expense;
                htmlString = `<div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNum(obj.value, type)}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;

            }

            itemDiv.insertAdjacentHTML('beforeend', htmlString);
        },

        deleteListItem: function (selector) {
            let el;
            el = document.getElementById(selector);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            domItems.addDescriptionInput.value = '';
            domItems.addValueInput.value = '';
            domItems.addDescriptionInput.focus();
        },

        displayBudget: function (obj) {

            let sign = obj.budget > 0 ? 'inc' : 'exp';

            domItems.budgetLable.textContent = formatNum(obj.budget, sign);
            domItems.expLable.textContent = formatNum(obj.expense, 'exp');
            domItems.incLable.textContent = formatNum(obj.income, 'inc');
            if (obj.percentage > 0) {
                domItems.percentageLable.textContent = `${obj.percentage}%`;
            } else {
                domItems.percentageLable.textContent = '---';
            }

        },

        displayPercentages: function (arr) {
            let fields = document.querySelectorAll(domItems.itemPercentagesString);


            let nodeForEach = function (list, callBackFn) {
                for (let i = 0; i < list.length; i++) {
                    callBackFn(list[i], i);
                }
            };

            nodeForEach(fields, function (curr, i) {


                if (arr[i] > 0) {
                    curr.textContent = `${arr[i]}%`;
                } else {
                    curr.textContent = '---';
                }

            });



        },

        displayDate: function () {
            let now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            domItems.dateLable.textContent = ` ${months[month]} ${year} `;

        },

        changedStyle: function () {
            domItems.addBtn.classList.toggle('red');
            domItems.addDescriptionInput.classList.toggle('red-focus');
            domItems.addValueInput.classList.toggle('red-focus');
            domItems.type.classList.toggle('red-focus');
        }



    };

})();

let BugetController = (function () {

    let Expense = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    };

    Expense.prototype.calculatePercentages = function (totalInc) {

        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentages = function () {

        return this.percentage;

    };

    let Income = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;

    };

    let data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1

    };

    let calculateTotals = function (type) {


        let total = data.allItems[type].reduce((sum, item) => sum + item.value, 0);
        data.totals[type] = total;


    };

    return {

        addItem: function (type, des, val) {
            let newItem, ID;
            if (data.allItems[type].length) {
                ID = data.allItems[type][(data.allItems[type].length) - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            if ((data.allItems[type]) !== undefined) {
                data.allItems[type].push(newItem);
            } else {
                data.allItems[type] = newItem;
            }
            return newItem;
        },

        calculateBudget: function () {
            let budget;
            //calculate the budget
            calculateTotals('inc');
            calculateTotals('exp');

            budget = data.totals.inc - data.totals.exp;
            data.budget = budget;
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentage: function () {
            data.allItems.exp.forEach(item => item.calculatePercentages(data.totals.inc));

        },
        getPercentages: function () {
            let percentageArr;
            percentageArr = data.allItems.exp.map(item => item.getPercentages());
            return percentageArr;
        },

        getBugget: function () {

            return {
                income: data.totals.inc,
                expense: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            };
        },

        deleteItem: function (type, id) {
            let ids, index;
            //   console.log(data.allItems[type][id]);
            ids = data.allItems[type].map(curr => curr.id);
            index = ids.indexOf(id);
            if (index !== -1) {

                data.allItems[type].splice(index, 1);
            }
            //   console.log(data.allItems[type]);

        },


        testing: data,
    };

})();

let Controller = (function (UICtrl, BgtCtrl) {
    let input;

    input = UICtrl.domItems;

    let setupEventListeners = function () {
        input.addBtn.addEventListener('click', addInput);

        document.addEventListener('keypress', function (e) {

            if (e.keyCode === 13) {
                //
                e.preventDefault();
                addInput();
            }
        });
        input.container.addEventListener('click', deleteItem);
        input.type.addEventListener('change', UICtrl.changedStyle);



    };

    let updateBudget = function () {
        let budgetObj;

        //calculate the budget
        BgtCtrl.calculateBudget();
        budgetObj = BgtCtrl.getBugget();
        //display the budget on the UI
        UICtrl.displayBudget(budgetObj);

    };

    let updatePrecentage = function () {
        let arr;
        BgtCtrl.calculatePercentage();
        arr = BgtCtrl.getPercentages();
        console.log(arr);
        //calculate%
        UICtrl.displayPercentages(arr);
        //read from bgtCtrl

        //update UI

    };


    let addInput = function () {

        if (input.addDescriptionInput.value !== '' && !isNaN(parseFloat(input.addValueInput.value)) && (parseFloat(input.addValueInput.value)) > 0) {

            let newItem;
            //add the item to buget controller
            newItem = BgtCtrl.addItem(input.type.value, input.addDescriptionInput.value, (parseFloat(input.addValueInput.value)));
            //add the item to the UI
            UICtrl.addListItem(newItem, input.type.value);
            //clear fields
            UICtrl.clearFields();
            // updateBudget
            updateBudget();
            updatePrecentage();
        }


    };

    let deleteItem = function (e) {
        let ID, splitID, type, id, el;
        // console.log(e.target);

        if (e.target.parentNode.className === input.deleteBtnString) {
            ID = e.target.parentNode.parentNode.parentNode.parentNode.id;

            splitID = ID.split('-');
            type = splitID[0];
            id = splitID[1];
            BgtCtrl.deleteItem(type, parseInt(id));

            UICtrl.deleteListItem(ID);

            updateBudget();

            updatePrecentage();
        }


    };



    return {
        init: function () {
            UICtrl.displayDate();
            setupEventListeners();
            console.log('start');
            UICtrl.displayBudget({
                income: 0,
                expense: 0,
                budget: 0,
                percentage: -1

            });

        }

    };

})(UIController, BugetController);

Controller.init();