import chai from 'chai';
import FilterStarRating from './filter-star-rating';
import Model from './model';

const expect = chai.expect;

describe('#FilterStarRating', () => {

    let model;

    describe('#deserialize', () => {

        it('should deserialize properties', () => {
            model = new FilterStarRating({
                prop: 'blah'
            });

            expect(model).to.be.instanceof(Model);
            expect(model).to.be.instanceof(FilterStarRating);
            expect(model.prop).to.eq('blah');
        });

    });

    describe('#init', () => {

        it('should init available ratings based on items, select all, and init counts', () => {
            model = new FilterStarRating({});
            model.init([
                {
                    info: {
                        rating: 1.1
                    }
                }, 
                {
                    info: {
                        rating: 3.5
                    }
                }, 
                {
                    info: {
                        rating: 3.1
                    }
                }
            ]);

            expect(model.allAvailableStarRatings).to.be.instanceof(Array);
            expect(model.allAvailableStarRatings.length).to.eq(2);
            expect(model.allAvailableStarRatings[0].value).to.eq(2);
            expect(model.allAvailableStarRatings[0].isSelected).to.be.true;
            expect(model.allAvailableStarRatings[0].filterCount).to.eq(0);
            expect(model.allAvailableStarRatings[1].value).to.eq(4);
            expect(model.allAvailableStarRatings[1].isSelected).to.be.true;
            expect(model.allAvailableStarRatings[1].filterCount).to.eq(0);
        });

        it('should init with items between 0 and 1 to 1', () => {
            model = new FilterStarRating({});
            model.init([
                {
                    info: {
                        rating: 0.1
                    }
                }
            ]);

            expect(model.allAvailableStarRatings).to.be.instanceof(Array);
            expect(model.allAvailableStarRatings.length).to.eq(1);
            expect(model.allAvailableStarRatings[0].value).to.eq(1);
        });

    });

    describe('#filterItem', () => {

        it('should init available ratings based on items, select all, and init counts', () => {
            model = new FilterStarRating({});
            model.init([
                {
                    info: {
                        rating: 0.1
                    }
                }, 
                {
                    info: {
                        rating: 1.1
                    }
                }, 
                {
                    info: {
                        rating:3.5
                    }
                }, 
                {
                    info: {
                        rating:3.1
                    }
                }, 
                {
                    info: {
                        rating: 4.7
                    }
                }
            ]);
            expect(model.filterItem({info: {rating:0.1}})).to.be.true;
            expect(model.filterItem({info: {rating:1.1}})).to.be.true;
            expect(model.filterItem({info: {rating:3.5}})).to.be.true;
            expect(model.filterItem({info: {rating:2.5}})).to.be.false;
            expect(model.filterItem({info: {rating:4.7}})).to.be.true;
        });

    });

});
