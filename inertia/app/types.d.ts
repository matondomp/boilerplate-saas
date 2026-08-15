// Generate a type of a lib vue-awesome-paginate, the lib has all types inside vue-awesome-paginate/dist/VueAwesomePaginatePlugin.d.ts, but cannot be loaded
// This need to work as vue plugin

declare module 'vue-awesome-paginate' {
  export default class VueAwesomePaginate {}
}
