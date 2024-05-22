const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}   ///app not work because App not defines


const Content = ({ parts }) => {			
  return (			
  <div>			
  <Part name={parts[0].name} exercise={parts[0].exercise} />			
  <Part name={parts[1].name} exercise={parts[1].exercise} />			
  <Part name={parts[2].name} exercise={parts[2].exercise} />			
  </div>			
  );			
  };						
				
export default App;
