'use strict';

export default [
    {
        name: 'clickout',

        config: {
            bind(element, { expression }, { context }) {
                element.clickOutEvent = event => {
                    if (!(element === event.target || element.contains(event.target))) {
                        // If expression is a method in the component, execute it
                        if (expression && typeof context[expression] === 'function') {
                            context[expression](event);

                        // If key/value pair (e.g. isActive, false), set property to value
                        } else if (typeof expression === 'string') {
                            const key = expression.split(', ')[0];
                            let value = expression.split(', ').slice(1, expression.split(',').length).join();

                            if (value === 'true' || value === 'false') {
                                value = JSON.parse(value);
                            }

                            context[key] = value;
                        } else {
                            console.error('Invalid expression passed into v-clickout event');
                        }
                    }
                };

                document.body.addEventListener('click', element.clickOutEvent);
            },

            unbind(element) {
                document.body.removeEventListener('click', element.clickOutEvent);
            },
        },
    },
];