
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Course = ({ course }) => (
  <div>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);
const Total = ({ parts }) => {
  let total = 0;
  for (let i = 0; i < parts.length; i++) {
    total += parts[i].exercises;
  }

  <div>
      {courses.map(course => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

     return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};


const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

// Part component*
const Part = ({ part }) => {
  return (
    <div>
      <p>{part.name}</p>
      <p>{part.exercises}</p>
    </div>
  );
};

// Content component
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

// Course component ///rendering the course name and its parts*
const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

const Total = ({ parts }) => {
  let total = 0;
  for (let i = 0; i < parts.length; i++) {
    total += parts[i].exercises;
  }
  return <p>Total of {total} exercises</p>;
};
