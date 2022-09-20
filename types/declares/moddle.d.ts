/************************************** 核心 Moddle 声明 *****************************************/
declare module 'moddle' {
  type UriOrPrefix = {
    uri?: string
    prefix?: string
  }

  export class Base {
    get(name: string): ReturnType<typeof Properties.prototype.get>
    set(name: string, value: any): ReturnType<typeof Properties.prototype.set>
    $instanceOf: typeof Moddle.prototype.hasType
  }

  export class ModdleElement extends Base {
    constructor(attrs: Object)
    readonly $type: string
    $attrs: Object | {}
    $parent: any;
    [field: string]: any

    static $model: Moddle
    static $descriptor: Descriptor
    static hasType(element: ModdleElement, type?: string): boolean
  }

  // Factory
  export class Factory {
    constructor(model: Moddle, properties: Properties)
    model: Moddle
    properties: Properties

    createType(descriptor: Descriptor): ModdleElement
  }

  export type BuiltinsKeys = 'String' | 'Boolean' | 'Integer' | 'Real' | 'Element'
  export type TypeConverters = {
    [T in Exclude<BuiltinsKeys, 'Element'>]: (s: string) => string | boolean | number
  }
  /**
   * Convert a type to its real representation
   */
  export type coerceType = <T extends Exclude<BuiltinsKeys, 'Element'>>(
    type: T,
    value: string
  ) => ReturnType<TypeConverters[T]>

  /**
   * Return whether the given type is built-in
   */
  export function isBuiltIn(type: BuiltinsKeys): boolean
  /**
   * Return whether the given type is simple
   */
  export function isSimple(type: Exclude<BuiltinsKeys, 'Element'>): boolean

  type ParsedName = {
    name: string
    prefix: string
    localName: string
  }
  /**
   * Parses a namespaced attribute name of the form (ns:)localName to an object,
   * given a default prefix to assume in case no explicit namespace is given.
   *
   * @param {String} name
   * @param {String} [defaultPrefix] the default prefix to take, if none is present.
   *
   * @return {ParsedName} the parsed name
   */
  export function parseName(name: string, defaultPrefix?: string): ParsedName

  // DescriptorBuilder
  type Property = {
    ns: ParsedName
    name: ParsedName['name']
    isId?: boolean
    isBody?: boolean
  }
  type DescriptorType = {
    name: string
    properties: Property[]
    superClass?: string[]
    extends?: string[]
    meta?: Object | {}
  }
  type Descriptor = {
    ns: ParsedName
    name: ParsedName['name']
    allTypes: DescriptorType[]
    allTypesByName: Record<string, DescriptorType[]>
    properties: Property[]
    propertiesByName: Record<string, Property[]>

    bodyProperty?: Property
    idProperty?: Property
  }

  export class DescriptorBuilder implements Descriptor {
    constructor(nameNs: ParsedName)
    ns: ParsedName
    name: ParsedName['name']
    allTypes: DescriptorType[]
    allTypesByName: Record<string, DescriptorType[]>
    properties: Property[]
    propertiesByName: Record<string, Property[]>
    bodyProperty?: Property
    idProperty?: Property

    build(): Descriptor

    addProperty(p: Property, idx?: number, validate?: boolean): void
    replaceProperty(oldProperty: Property, newProperty: Property, replace?: boolean): void | never
    redefineProperty(
      p: Property,
      targetPropertyName: `${string}#${string}`,
      replace?: boolean
    ): void | never
    addNamedProperty(p: Property, validate?: boolean): void | never
    removeNamedProperty(p: Property): void
    setBodyProperty(p: Property, validate?: boolean): void | never
    setIdProperty(p: Property, validate?: boolean): void | never

    assertNotDefined(p: Property, name?: string): void | never

    hasProperty(name: string): Property | undefined

    addTrait(t: DescriptorType, inherited: boolean): void
  }

  // Registry
  export interface Package {
    name: string
    prefix: string
    types: DescriptorType[]
  }

  export class Registry {
    constructor(packages: Package[], properties: Properties)
    packageMap: Record<string, Package>
    typeMap: Record<string, DescriptorType>
    packages: Package[]
    properties: Properties

    getPackage(uriOrPrefix: UriOrPrefix): Package
    getPackages(): Package[]
    registerPackage(pkg: Package): number
    /**
     * Register a type from a specific package with us
     * @param {DescriptorType} type
     * @param {Package} pkg
     */
    registerType(type: DescriptorType, pkg: Package): void
    /**
     * Traverse the type hierarchy from bottom to top,
     * calling iterator with (type, inherited) for all elements in
     * the inheritance chain.
     *
     * @param {Object} nsName
     * @param {Function} iterator
     * @param {Boolean} [trait=false]
     */
    mapTypes(nsName: Object, iterator: Function, trait?: boolean)

    /**
     * Returns the effective descriptor for a type.
     *
     * @param  {String} name the namespaced name (ns:localName) of the type
     *
     * @return {Descriptor} the resulting effective descriptor
     */
    getEffectiveDescriptor(name: string): DescriptorBuilder

    definePackage(target: Descriptor, pkg: Package): void
  }

  //Properties
  export class Properties {
    constructor(model: Moddle)
    model: Moddle

    set(target: ModdleElement, name: string, value: any): void
    get(target: ModdleElement, name: string): any
    define(target: ModdleElement, name: string, options: PropertyDescriptor): void
    defineDescriptor(target: Omit<ModdleElement, '$descriptor'>, descriptor: Descriptor): void
    defineModel(target: Omit<ModdleElement, '$model'>, model: ModdleElement): void
  }

  // Moddle
  export class Moddle {
    constructor(packages: Package[])

    properties: Properties
    factory: Factory
    registry: Registry
    typeCache: Record<string, ModdleElement>

    create(type: Descriptor | string, attrs: any): ModdleElement
    getType(type: string | Descriptor): DescriptorBuilder
    createAny(name: string, nsUri: string, properties?: Properties): void
    /**
     * Returns a registered package by uri or prefix
     *
     * @return {Object} the package
     */
    getPackage: typeof Registry.prototype.getPackage
    /**
     * Returns a snapshot of all known packages
     *
     * @return {Object} the package
     */
    getPackages: typeof Registry.prototype.getPackages
    /**
     * Returns the descriptor for an element
     */
    getElementDescriptor(element: ModdleElement): Descriptor
    /**
     * Returns true if the given descriptor or instance
     * represents the given type.
     *
     * May be applied to this, if element is omitted.
     */
    hasType(element: ModdleElement | string, type?: string): boolean
    /**
     * Returns the descriptor of an elements named property
     */
    getPropertyDescriptor(element: ModdleElement, property: Property): Descriptor
    /**
     * Returns a mapped type's descriptor
     */
    getTypeDescriptor(type: string): Descriptor
  }

  export type isBuiltInType = typeof isBuiltIn
  export type isSimpleType = typeof isSimple
  export type parseNameNS = typeof parseName
}
