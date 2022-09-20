declare module 'object-refs' {
  // 要使用的属性描述符在  Refs 实例中指定属性
  type AttributeDescriptor = {
    name: string
    collection: boolean
    enumerable: boolean
    inverse?: AttributeDescriptor
  }
  type RefsCollection = Array<Object> & {
    remove(element: unknown): unknown
    contains(element: unknown): boolean
    add(element: unknown, idx?: number): unknown
    __refs_collection: true
  }

  /**
   * @example
   *
   * var refs = Refs({ name: 'wheels', collection: true, enumerable: true }, { name: 'car' });
   *
   * var car = { name: 'toyota' };
   * var wheels = [{ pos: 'front-left' }, { pos: 'front-right' }];
   *
   * refs.bind(car, 'wheels');
   *
   * car.wheels // []
   * car.wheels.add(wheels[0]);
   * car.wheels.add(wheels[1]);
   *
   * car.wheels // [{ pos: 'front-left' }, { pos: 'front-right' }]
   *
   * wheels[0].car // { name: 'toyota' };
   * car.wheels.remove(wheels[0]);
   *
   * wheels[0].car // undefined
   */
  export class Refs {
    constructor(a: AttributeDescriptor, b: AttributeDescriptor)
    private props: Record<string, AttributeDescriptor>

    //将双向引用的一侧绑定到目标对象。
    bind(target: Object, property: string | AttributeDescriptor): void
    ensureRefsCollection(target: Object, property: AttributeDescriptor): RefsCollection
    ensureBound(target: Object, property: AttributeDescriptor): void
    unset(target, property, value): void
    set(target, property, value): void
  }

  export type Collection = {
    extend(collection: Object[], refs: Refs, property: Object, target: Object): RefsCollection
    isExtended(collection: Object[] | RefsCollection): boolean
  }
}
