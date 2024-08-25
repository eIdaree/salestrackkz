// import React, { useState } from 'react';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { db } from '../../config/firebase-config';
// import { collection, addDoc, Timestamp } from 'firebase/firestore';

// type TaskFormData = {
//   title: string;
//   description: string;
//   deadline: string;
// };

// const AddTask: React.FC<{ workerId: string }> = ({ workerId }) => {
//   const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>();
//   const [error, setError] = useState<string | null>(null);

//   const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
//     try {
//       await addDoc(collection(db, 'tasks'), {
//         ...data,
//         workerId,
//         deadline: Timestamp.fromDate(new Date(data.deadline)),
//       });
//     } catch (err) {
//       setError('Failed to add task');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input type="text" {...register('title', { required: true })} placeholder="Title" />
//       {errors.title && <span>This field is required</span>}
//       <input type="text" {...register('description', { required: true })} placeholder="Description" />
//       {errors.description && <span>This field is required</span>}
//       <input type="datetime-local" {...register('deadline', { required: true })} placeholder="Deadline" />
//       {errors.deadline && <span>This field is required</span>}
//       <button type="submit">Add Task</button>
//       {error && <span>{error}</span>}
//     </form>
//   );
// };

// export default AddTask;
