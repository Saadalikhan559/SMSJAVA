import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const CreateCategory = () => {
    const { axiosInstance } = useContext(AuthContext);

    const [category, setCategory] = useState([]);

    const [addCategory, setAddCategory] = useState('');
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');

    const [editCategoryId, setEditCategoryId] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    const [deleteCategoryId, setDeleteCategoryId] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const [addSuccess, setAddSuccess] = useState('');
const [editSuccess, setEditSuccess] = useState('');
const [deleteSuccess, setDeleteSuccess] = useState('');


    // Fetch categories
    const getExpenseCategory = async () => {
        try {
            const res = await axiosInstance.get('/d/Expense-Category/');
            setCategory(res.data);
        } catch (err) {
            console.error('Error fetching categories', err);
        }
    };

    useEffect(() => {
        getExpenseCategory();
    }, []);

    // Handle Add
 const handleAdd = async (e) => {
    e.preventDefault();
    if (!addCategory.trim()) {
        return setAddError('Category name is required');
    }

    setAddLoading(true);
    setAddError('');
    setAddSuccess('');

    try {
        const res = await axiosInstance.post('/d/Expense-Category/', { name: addCategory });
        if (res.status === 201 || res.status === 200) {
            setAddCategory('');
            setAddSuccess('Category added successfully!');
            getExpenseCategory();
            setTimeout(() => setAddSuccess(''), 3000);
        }
    } catch (err) {
        setAddError(err.response?.data?.detail || 'Something went wrong');
    } finally {
        setAddLoading(false);
    }
};


    // Handle Edit
   const handleEdit = async (e) => {
    e.preventDefault();
    if (!editCategoryId) return setEditError('Please select a category');
    if (!editCategoryName.trim()) return setEditError('New name is required');

    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
        await axiosInstance.patch(`/d/Expense-Category/${editCategoryId}/`, {
            name: editCategoryName,
        });
        setEditCategoryId('');
        setEditCategoryName('');
        setEditSuccess('Category updated successfully!');
        getExpenseCategory();
        setTimeout(() => setEditSuccess(''), 3000);
    } catch (err) {
        setEditError(err.response?.data?.detail || 'Something went wrong');
    } finally {
        setEditLoading(false);
    }
};


    // Handle Delete
const handleDelete = async (e) => {
    e.preventDefault();
    if (!deleteCategoryId) return setDeleteError('Select a category to delete');

    setDeleteLoading(true);
    setDeleteError('');
    setDeleteSuccess('');

    try {
        await axiosInstance.delete(`/d/Expense-Category/${deleteCategoryId}/`);
        setDeleteCategoryId('');
        setDeleteSuccess('Category deleted successfully!');
        getExpenseCategory();
        setTimeout(() => setDeleteSuccess(''), 3000);
    } catch (err) {
        setDeleteError(err.response?.data?.detail || 'Something went wrong');
    } finally {
        setDeleteLoading(false);
    }
};


return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 mb-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                Manage Categories <i className="fa-solid fa-list-check"></i>
            </h1>

            {/* Add Category */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Add Category</h2>
                <form onSubmit={handleAdd}>
                    <div className="mb-4">
                        <input
                            value={addCategory}
                            onChange={(e) => setAddCategory(e.target.value)}
                            type="text"
                            placeholder="Enter category name"
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    {addError && <p className="text-sm text-red-500 mb-2">{addError}</p>}
                    {addSuccess && <p className="text-sm text-green-600 mb-2">{addSuccess}</p>}

                    <button
                        type="submit"
                        className="btn px-4 py-2 bgTheme text-white rounded-md"
                        disabled={addLoading}
                    >
                        {addLoading ? 'Adding...' : 'Add Category'}
                    </button>
                </form>
            </div>

            {/* Edit Category */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
                <form onSubmit={handleEdit}>
                    <div className="mb-4">
                        <select
                            value={editCategoryId}
                            onChange={(e) => setEditCategoryId(e.target.value)}
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="">Select category</option>
                            {category.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <input
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            type="text"
                            placeholder="New category name"
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    {editError && <p className="text-sm text-red-500 mb-2">{editError}</p>}
                    {editSuccess && <p className="text-sm text-green-600 mb-2">{editSuccess}</p>}

                    <button
                        type="submit"
                        className="btn px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-300 rounded-md"
                        disabled={editLoading}
                    >
                        {editLoading ? 'Updating...' : 'Update Category'}
                    </button>
                </form>
            </div>

            {/* Delete Category */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Delete Category</h2>
                <form onSubmit={handleDelete}>
                    <div className="mb-4">
                        <select
                            value={deleteCategoryId}
                            onChange={(e) => setDeleteCategoryId(e.target.value)}
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="">Select category</option>
                            {category.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {deleteError && <p className="text-sm text-red-500 mb-2">{deleteError}</p>}
                    {deleteSuccess && <p className="text-sm text-green-600 mb-2">{deleteSuccess}</p>}

                    <button
                        type="submit"
                        className="btn px-4 py-2 border border-red-300 bg-red-50 text-red-700 rounded-md"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete Category'}
                    </button>
                </form>
            </div>
        </div>
    </div>
);


};

export default CreateCategory;
