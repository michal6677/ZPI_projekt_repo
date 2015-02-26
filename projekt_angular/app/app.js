'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['firebase']);

app.controller('MainCtrl',function($scope,$firebase){

        var ref = new Firebase('https://sizzling-torch-1975.firebaseio.com/categories/');
        var sync = $firebase(ref);
        $scope.categories = sync.$asArray();
        var ref2 = new Firebase('https://sizzling-torch-1975.firebaseio.com/bookmarks/');
        var sync2 = $firebase(ref2);
        $scope.bookmarks = sync2.$asArray();

        $scope.currentCategory = null;

        function setCurrentCategory (category){
            $scope.currentCategory = category;

            cancelCreating();
            cancelEditing();
        }

        function isCurrentCategory (category){
           return $scope.currentCategory !== null && category.name === $scope.currentCategory.name;
        }
        function isCategory(){
            return $scope.currentCategory;
        }

        $scope.setCurrentCategory = setCurrentCategory;
        $scope.isCurrentCategory = isCurrentCategory;
        $scope.isCategory = isCategory;


        //-------------------------------------------------------------------------------------------------
        // CRUD
        //-------------------------------------------------------------------------------------------------

        function resetCreateForm() {
            $scope.newBookmark = {
                title: '',
                url: '',
                category: $scope.currentCategory
            };
        }

        function createBookmark(bookmark) {
            bookmark.id = $scope.bookmarks.length;
            $scope.bookmarks.$add(bookmark);

            resetCreateForm();
        }

        $scope.createBookmark = createBookmark;

        $scope.editedBookmark = null;

        function setEditedBookmark(bookmark) {
            $scope.editedBookmark = angular.copy(bookmark);
        }

        function updateBookmark(bookmark) {
            var index = _.findIndex($scope.bookmarks, function (b) {
                return b.id == bookmark.id
            });
            $scope.bookmarks[index] = bookmark;
            $scope.bookmarks.$save(bookmark);
            $scope.editedBookmark = null;
            $scope.isEditing = false;
        }

        function isSelectedBookmark(bookmarkId) {
            return $scope.editedBookmark !== null && $scope.editedBookmark.id === bookmarkId;
        }

        $scope.setEditedBookmark = setEditedBookmark;
        $scope.updateBookmark = updateBookmark;
        $scope.isSelectedBookmark = isSelectedBookmark;

        function deleteBookmark(bookmark) {
            $scope.bookmarks.$remove(bookmark);
        }

        $scope.deleteBookmark = deleteBookmark;

        //-------------------------------------------------------------------------------------------------
        // CREATING AND EDITING STATES
        //-------------------------------------------------------------------------------------------------
        function resetCreateCategoryForm() {
            $scope.newCategory = {
                name: ''
            };
        }

        function createCategory(category) {
            category.id = $scope.categories.length;
            $scope.categories.$add(category);
            $scope.currentCategory = category;
            resetCreateCategoryForm();
        }

        function deleteCategory(category) {
            var n = $scope.bookmarks.length;

            for(var i=0; i <n; i++ ) {
                if(category.name === $scope.bookmarks[i].category.name){
                    $scope.bookmarks.$remove($scope.bookmarks[i]);
                }
            }
            $scope.categories.$remove(category);
        }

        $scope.createCategory = createCategory;
        $scope.deleteCategory = deleteCategory;
        //-------------------------------------------------------------------------------------------------
        // CREATING AND EDITING STATES
        //-------------------------------------------------------------------------------------------------
        $scope.isCreating = false;
        $scope.isEditing = false;

        function startCreating() {
            $scope.isCreating = true;
            $scope.isEditing = false;

            resetCreateForm();
        }

        function cancelCreating() {
            $scope.isCreating = false;
        }

        function startEditing() {
            $scope.isCreating = false;
            $scope.isEditing = true;
        }

        function cancelEditing() {
            $scope.isEditing = false;
        }

        function shouldShowCreating() {
            return $scope.currentCategory && !$scope.isEditing;
        }

        function shouldShowEditing() {
            return $scope.isEditing && !$scope.isCreating;
        }

        $scope.startCreating = startCreating;
        $scope.cancelCreating = cancelCreating;
        $scope.startEditing = startEditing;
        $scope.cancelEditing = cancelEditing;
        $scope.shouldShowCreating = shouldShowCreating;
        $scope.shouldShowEditing = shouldShowEditing;


        //-------------------------------------------------------------------------------------------------
        // CREATING AND EDITING STATES
        //-------------------------------------------------------------------------------------------------

        $scope.isCreatingCat = false;

        function startCreatingCat() {
            $scope.isCreatingCat = true;
        }

        function cancelCreatingCat() {
            $scope.isCreatingCat = false;
        }
        $scope.startCreatingCat = startCreatingCat;
        $scope.cancelCreatingCat = cancelCreatingCat;

    });