import { useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronDown, UserPlus } from 'lucide-react';
import { useStudents } from '../../../contexts/StudentsContext';

export default function StudentDropdown({ value, onChange, onAddNew }) {
  const { students } = useStudents();
  const [query, setQuery] = useState('');

  const selectedStudent = useMemo(() => {
    return students.find(s => s.id === value);
  }, [students, value]);

  const filteredStudents = useMemo(() => {
    if (query === '') return students;

    return students.filter((student) => {
      const searchStr = query.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchStr) ||
        student.postcode.toLowerCase().includes(searchStr)
      );
    });
  }, [students, query]);

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <div className="relative">
          <Combobox.Input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-learner-red focus:border-transparent pr-10"
            displayValue={() =>
              selectedStudent
                ? `${selectedStudent.name} (${selectedStudent.postcode})`
                : ''
            }
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a student..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg border border-gray-200">
          {filteredStudents.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              No students found.
            </div>
          ) : (
            filteredStudents.map((student) => (
              <Combobox.Option
                key={student.id}
                value={student.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-4 ${
                    active ? 'bg-learner-red text-white' : 'text-gray-900'
                  }`
                }
              >
                {student.name} ({student.postcode})
              </Combobox.Option>
            ))
          )}

          <button
            type="button"
            onClick={onAddNew}
            className="w-full flex items-center gap-2 px-4 py-2 text-left text-learner-red hover:bg-gray-100 border-t border-gray-200 mt-1"
          >
            <UserPlus size={16} />
            Add New Student
          </button>
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
