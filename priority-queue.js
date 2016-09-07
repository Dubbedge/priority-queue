/**
 * @priority-queue.js
 * Sample implementation of a priority queue using a binary heap.
 *
 * Rules followed:
 *
 * 1. The queue must have an insert method which takes a number.
 *      a. If the number is not already present in the queue, it is added to the queue with a priority equal to the number.
 *      b. If the number is present, it's priority is increased by one.
 * 2. The queue must have a remove method which does not take any arguments, and removes and returns the number with the highest priority.
 * 3. The insert and remove functions should run in O(lg n)
 * 4. You can assume that all inputs are safe.
 * 5. Please don't pull in any external libraries.
 *
 * TODO: Add documentation and lintify it.
 *
 * Created by Aaron C. Schafer on 8/30/2016.
 */
var Pq = (function() {
    var _heapItem = function(number) {
        this.number = this.priority = number;
    };

    var _binaryHeap = function () {
        // list of items added
        this.array = [];

        // keep track of the index of each item in the heap for order so we can do an order 1 lookup if a number has
        // already been added to heap
        this.indexes = {};
    };

    _binaryHeap.prototype.isNumeric = function (number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    };

    _binaryHeap.prototype.size = function() {
        return this.array.length;
    };

    _binaryHeap.prototype.getParentIndex = function (childIndex) {
        return ((childIndex + 1) >> 1) - 1; // same as Math.floor((childIndex + 1) / 2) - 1
    };

    _binaryHeap.prototype.getRightChildIndex = function (index) {
        return (index + 1) << 1; // same as (index + 1) * 2
    };

    _binaryHeap.prototype.getLeftChildIndex = function (rightIndex) {
        return rightIndex - 1;
    };

    _binaryHeap.prototype.add = function(number) {
        //  if item exists, increase priority (lower = higher)
        var index = this.indexes[number];

        if (this.isNumeric(index)) {
            this.array[index].priority -= 1;
            this.bubbleUpItem(index);
            return;
        }

        // add item to heap
        var heapItem = new _heapItem(number);

        this.array.push(heapItem);
        this.bubbleUpItem(this.array.length - 1);
    };

    _binaryHeap.prototype.remove = function() {
        if (this.array.length === 0) {
            return null;
        }

        // Grab the item so we can return the highest priority number
        var removedItem = this.array[0];
        var removedNumber = removedItem.number;

        // overwrite top item with last item and let it sink to correct position
        var lastItem = this.array.pop();
        delete this.indexes[removedNumber];

        // sink item if needed
        if (this.size() > 0) {
            this.array[0] = lastItem;
            this.indexes[lastItem.number] = 0;
            this.sinkItem();
        }

        // uncomment the line below to see the number and priority associated to each
        return removedItem;
        //return removedNumber;
    };

    _binaryHeap.prototype.bubbleUpItem = function(currentIndex) {
        if (!this.isNumeric(currentIndex) || currentIndex < 0 || currentIndex > this.array.length - 1) {
            return;
        }

        var currentItem = this.array[currentIndex],
            parentIndex,
            parentItem;

        // starting index for current item if it doesn't already have one
        if (!this.isNumeric(this.indexes[currentItem.number])) {
            this.indexes[currentItem.number] = currentIndex;
        }

        // bubble item up until it is at correct position
        while (currentIndex > 0) {
            parentIndex = this.getParentIndex(currentIndex);
            parentItem = this.array[parentIndex];

            if (currentItem.priority >= parentItem.priority) {
                break;
            }

            // swap with parent
            this.indexes[parentItem.number] = currentIndex;
            this.array[parentIndex] = currentItem;
            this.array[currentIndex] = parentItem;
            this.indexes[currentItem.number] = currentIndex = parentIndex;
        }
    };

    _binaryHeap.prototype.sinkItem = function() {
        var currentIndex = 0,
            currentItem = this.array[currentIndex],
            currentPriority = currentItem.priority,
            rightChildIndex,
            leftChildIndex,
            swapIndex,
            childNumber,
            leftChildItem,
            leftChildPriority,
            rightChildItem,
            rightChildPriority;

        while (true) {
            rightChildIndex = this.getRightChildIndex(currentIndex);
            leftChildIndex = this.getLeftChildIndex(rightChildIndex);
            swapIndex = null;
            childNumber = null;


            if (leftChildIndex < this.size()) {
                leftChildItem = this.array[leftChildIndex];
                leftChildPriority = leftChildItem.priority;

                if (leftChildPriority < currentPriority) {
                    swapIndex = leftChildIndex;
                    childNumber = leftChildItem.number;
                }
            }

            if (rightChildIndex < this.size()) {
                rightChildItem = this.array[rightChildIndex];
                rightChildPriority = rightChildItem.priority;

                if (rightChildPriority < (!swapIndex ? currentPriority : leftChildPriority)) {
                    swapIndex = rightChildIndex;
                    childNumber = rightChildItem.number;
                }
            }

            // if no swap was made, item is in the right place
            if (!swapIndex) {
                break;
            }

            // moving on
            this.indexes[childNumber] = currentIndex;
            this.array[currentIndex] = this.array[swapIndex];
            this.array[swapIndex] = currentItem;
            this.indexes[currentItem.number] = currentIndex = swapIndex;
        }
    };

    var _tests = {
        test0: function() {
            var binaryHeap = new _binaryHeap();

            try {
                var item = binaryHeap.remove();
                return item === null;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        test1: function() {
            var binaryHeap = new _binaryHeap();

            binaryHeap.add(0);

            var item = binaryHeap.remove();

            return item.number === 0 && item.priority === 0;
        },
        test2: function() {
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(0); // priority = 0
            binaryHeap.add(0); // priority = -1

            var item = binaryHeap.remove();

            return 0 === item.number && item.priority === -1
        },
        test3: function() {
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(1);
            binaryHeap.add(0);

            var item = binaryHeap.remove();

            return item.number === 0 && item.priority === 0;
        },
        test4: function() {
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(0); // priority 0
            binaryHeap.add(1); // priority 1
            binaryHeap.add(1); // priority 0
            binaryHeap.add(1); // priority -1

            var item = binaryHeap.remove();

            return item.number === 1 && item.priority === -1;
        },
        test5: function() {
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(0);
            binaryHeap.add(1);
            binaryHeap.remove(); // item 0

            var item = binaryHeap.remove(); // item 1

            return item.number === 1 && item.priority === 1;
        },
        test6: function(){
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(1);
            binaryHeap.add(0);
            binaryHeap.remove(); // item 0

            var item = binaryHeap.remove(); // item 1

            return item.number === 1 && item.priority === 1;
        },
        test7: function(){
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(0);
            binaryHeap.add(2);
            binaryHeap.add(1);

            binaryHeap.remove(); // item 0

            var item = binaryHeap.remove(); // item 1

            return item.number === 1 && item.priority === 1;
        },
        test8: function(){
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(3); // priority 3
            binaryHeap.add(2); // priority 2
            binaryHeap.add(1); // priority 1
            binaryHeap.add(3); // priority 2
            binaryHeap.add(3); // priority 1
            binaryHeap.add(3); // priority 0

            var item = binaryHeap.remove();

            return item.number === 3 && item.priority === 0;
        },
        test9: function(){
            var binaryHeap = new _binaryHeap();
            binaryHeap.add(3); // priority 3
            binaryHeap.add(2); // priority 2
            binaryHeap.add(1); // priority 1
            binaryHeap.add(3); // priority 2
            binaryHeap.add(3); // priority 1
            binaryHeap.add(3); // priority 0

            var item1 = binaryHeap.remove(); // item 3
            var item2 = binaryHeap.remove(); // item 1
            var item3 = binaryHeap.remove(); // item 2

            return (
                item1.number === 3 && item1.priority === 0 &&
                item2.number === 1 && item2.priority === 1 &&
                item3.number === 2 && item3.priority === 2
            );
        },
        /**
         * Called after body loads.
         *
         * Test adding a random list of numbers to a priority queue
         *
         * @param {number} arraySize
         *  The number of randomly generated items to be added to the list
         * @param {number} ratio
         *  The ratio percentage to increase the number of duplicated numbers.
         */
        test10: function(arraySize, ratio) {
            var binaryHeap = new _binaryHeap(),
                array = [],
                priorities = {},
                item,
                i,
                number,
                result = true;

            for (i = 0 ;i < (arraySize || 32); i += 1) {
                number = Math.floor(Math.random() * (arraySize || 32) * ((ratio / 100) || 1));
                array.push(number);
            }

            for (i = 0; i < array.length; i += 1) {
                binaryHeap.add(array[i]);
            }

            for (i = 0; i < array.length; i += 1) {
                if (!binaryHeap.isNumeric(priorities[array[i]])) {
                    priorities[array[i]] = array[i];
                } else {
                    priorities[array[i]] -= 1;
                }
            }

            while(binaryHeap.size() > 0) {
                item = binaryHeap.remove();
                result = result && item.priority === priorities[item.number];
            }

            return result;
        }
    };

    return {
        test: function() {
            console.log("test 0: " + _tests.test0());
            console.log("test 1: " + _tests.test1());
            console.log("test 2: " + _tests.test2());
            console.log("test 3: " + _tests.test3());
            console.log("test 4: " + _tests.test4());
            console.log("test 5: " + _tests.test5());
            console.log("test 6: " + _tests.test6());
            console.log("test 7: " + _tests.test7());
            console.log("test 8: " + _tests.test8());
            console.log("test 9: " + _tests.test9());
            console.log("test 10: " + _tests.test10(100, 50));
        }
    }
})();