import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Tasks } from "./components/Tasks";

//const LOCAL_STORAGE_KEY = 'todo:tasks';

function App() {
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    fetch('http://localhost:3001/api/dados')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data); // Supondo que você tenha um estado para armazenar os dados
      })
      .catch((err) => console.error('Erro ao buscar os dados', err));
  }, []);


  const setTasksAndSave = (novosDados) => {
    fetch('http://localhost:3001/api/dados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novosDados),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message); // Exibe a mensagem de sucesso
      })
      .catch((err) => console.error('Erro ao salvar os dados', err));
    setTasks(novosDados);
  };

  function addTask(taskTitle) {
    setTasksAndSave([...tasks, {
      id: crypto.randomUUID(),
      title: taskTitle,
      isCompleted: false
    }]);
  }

  function deleteTaskById(taskId) {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasksAndSave(newTasks);
  }

  function toggleTaskCompletedById(taskId) {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isCompleted: !task.isCompleted
        }
      }
      return task;
    });
    setTasksAndSave(newTasks);
  }

  return (
    <>
      <Header handleAddTask={addTask} />
      <Tasks
        tasks={tasks}
        onDelete={deleteTaskById}
        onComplete={toggleTaskCompletedById}
      />
    </>
  )
}

export default App
