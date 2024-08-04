export type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: CreateMutable<Type[Property]>;
};
