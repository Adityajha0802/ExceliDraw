"use client";


interface InputProps {
  className?: string;
  type:string;
  placeholder:string;
  reference?:any;
  onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

export const Input = ({className,type,placeholder,reference,onChange}: InputProps) => {
  return (
    <input
      className={className}
      placeholder={placeholder}
      type={type}
      ref={reference}
      onChange={onChange}
    >
    </input>
  );
};