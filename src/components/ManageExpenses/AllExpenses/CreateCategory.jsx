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
        <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 mb-24 md:mb-10">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                    <i className="fa-solid fa-list-check"></i> Manage Categories
                </h1>
                <div className="flex flex-wrap md:flex-nowrap gap-6 justify-between">
                    {/* Add Category */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-2">Add Category</h2>
                        <form onSubmit={handleAdd}>
                            <input
                                value={addCategory}
                                onChange={(e) => setAddCategory(e.target.value)}
                                type="text"
                                placeholder="Enter category name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                            />
                            {addError && <p className="text-sm text-red-500 mb-1">{addError}</p>}
                            {addSuccess && <p className="text-sm text-green-600 mb-1">{addSuccess}</p>}
                            <button
                                type="submit"
                                className="w-full btn bgTheme text-white rounded-md py-2"
                                disabled={addLoading}
                            >
                                {addLoading ? 'Adding...' : 'Add'}
                            </button>
                        </form>
                    </div>

                    {/* Edit Category */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-2">Edit Category</h2>
                        <form onSubmit={handleEdit}>
                            <select
                                value={editCategoryId}
                                onChange={(e) => setEditCategoryId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md mb-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                            >
                                <option value="">Select category</option>
                                {category.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                type="text"
                                placeholder="New category name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                            />
                            {editError && <p className="text-sm text-red-500 mb-1">{editError}</p>}
                            {editSuccess && <p className="text-sm text-green-600 mb-1">{editSuccess}</p>}
                            <button
                                type="submit"
                                className="w-full btn border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-md py-2"
                                disabled={editLoading}
                            >
                                {editLoading ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>

                    {/* Delete Category */}
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-2">Delete Category</h2>
                        <form onSubmit={handleDelete}>
                            <select
                                value={deleteCategoryId}
                                onChange={(e) => setDeleteCategoryId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md mb-2 bg-white dark:bg-gray-700 dark:text-gray-200"
                            >
                                <option value="">Select category</option>
                                {category.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {deleteError && <p className="text-sm text-red-500 mb-1">{deleteError}</p>}
                            {deleteSuccess && <p className="text-sm text-green-600 mb-1">{deleteSuccess}</p>}
                            <button
                                type="submit"
                                className="w-full btn border border-red-300 bg-red-50 text-red-700 rounded-md py-2"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );


};

export default CreateCategory;
