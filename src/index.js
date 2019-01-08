import ObjectStore from './stores/object-store';
import ClassStore from './stores/class-store';
import SessiontStorageStore from './stores/session-storage-store';
import MemorySessionStorage from './stores/interfaces/impl/memory-session-storage';
import Model from './models/model';
import Form from './models/form';
import FormField from './models/form-field';
import FilterFeature from './models/filter-feature';
import FilterGeo from './models/filter-geo';
import FilterPrice from './models/filter-price';
import FilterStarRating from './models/filter-star-rating';
import FilterText from './models/filter-text';
import GetSet from './utils/getset';

export const stores = {
    ObjectStore: ObjectStore,
    ClassStore: ClassStore,
    SessionStorageStore: SessiontStorageStore
};

export const models = {
    Model: Model,
    Form: Form,
    FormField: FormField,
    FilterFeature: FilterFeature,
    FilterGeo: FilterGeo,
    FilterPrice: FilterPrice,
    FilterStarRating: FilterStarRating,
    FilterText: FilterText
};

export const utils = {
    GetSet: GetSet,
    MemorySessionStorage: MemorySessionStorage
};
