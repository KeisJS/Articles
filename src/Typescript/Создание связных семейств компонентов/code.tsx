// @ts-nocheck

import { FC, PropsWithChildren } from 'react'

function createConcreteComponent<P, K extends keyof P, Name extends string>(
  Component: FC<P>,
  partial: Pick<P, K>,
  name: Name
) {
  return {
    [name]: (props: Omit<P, K>) => {
      return <Component {...partial} {...(props as P)} />;
    }
  } as Record<Name, FC<Omit<P, K>>>;
}

type CreateConcreteFactory<P, Map extends Record<string, Partial<P>>> = {
  [Name in keyof Map]: FC<Omit<P, keyof Map[Name]>>
}
function createConcreteFactory <P, Map extends Record<string, Partial<P>>>(Component: FC<P>, map: Map) {

  return Object
    .entries<Partial<P>>(map)
    .reduce<Record<string, FC<P>>>((result, [name, currentProps]) => {

      return {
        ...result,
        [name]: (props: P) => <Component {...props} {...currentProps} />
      }
    }, {}) as CreateConcreteFactory<P, Map>
}

interface ButtonProps {
  color: string;
  size: "small" | "medium" | "large";
  variant: "contained" | "outlined";
  onClick?: () => void;
}

const Button = ({
                  color,
                  size,
                  variant,
                  onClick,
                  children,
                }: PropsWithChildren<ButtonProps>) => {
  const style = { backgroundColor: color };
  const className = `${size} ${variant}`;

  return (
    <button
      style={style}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

const { ImportantRedButtonTwo } = createConcreteComponent(Button, {
  color: "red",
  size: "large",
  variant: "contained",
}, 'ImportantRedButtonTwo')

const { ImportantRedButtonThree, ImportantRedButtonFour }  = createConcreteFactory(Button, {
  ImportantRedButtonThree: {
    color: 'red',
    variant: 'contained',
    size: 'medium'
  },
  ImportantRedButtonFour: {
    color: 'red',
    size: 'large',
    variant: 'contained',
  }
} as const)


export { ImportantRedButtonTwo, ImportantRedButtonThree, ImportantRedButtonFour }
