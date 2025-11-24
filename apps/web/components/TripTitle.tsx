interface TripTitleProps {
  title: string;
}

export function TripTitle({ title }: TripTitleProps) {
  return (
    <h1 className="text-5xl sm:text-7xl font-medium text-foreground">
      {title}
    </h1>
  );
}
