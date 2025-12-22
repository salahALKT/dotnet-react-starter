const Todo = ({ title, description, isComplete, onToggle, onDelete }) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={isComplete}
          onChange={onToggle}
          className="w-5 h-5" 
        />
        <span className={`flex-1 text-lg font-bold ${isComplete ? 'line-through text-gray-500' : ''}`}>
          {title}
        </span>
      </div>
      <p className={`text-sm ${isComplete ? 'line-through text-gray-500' : ''}`}>{description}</p>
      <button 
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 self-start"
      >
        Delete
      </button>
    </div>
  );
};

export default Todo;