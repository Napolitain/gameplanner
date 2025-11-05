#pragma once

#include "MainWindow.g.h"
#include "GamePlanner.h"
#include "GameFactory.h"
#include <winrt/Microsoft.UI.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <memory>
#include <vector>

namespace winrt::GamePlannerApp::implementation
{
    struct MainWindow : MainWindowT<MainWindow>
    {
        MainWindow();

        void GamesListView_SelectionChanged(
            Windows::Foundation::IInspectable const& sender,
            Microsoft::UI::Xaml::Controls::SelectionChangedEventArgs const& e);

        void AddItemButton_Click(
            Windows::Foundation::IInspectable const& sender,
            Microsoft::UI::Xaml::RoutedEventArgs const& e);

        void RemoveStepButton_Click(
            Windows::Foundation::IInspectable const& sender,
            Microsoft::UI::Xaml::RoutedEventArgs const& e);

        void ClearButton_Click(
            Windows::Foundation::IInspectable const& sender,
            Microsoft::UI::Xaml::RoutedEventArgs const& e);

        void SearchTextBox_TextChanged(
            Windows::Foundation::IInspectable const& sender,
            Microsoft::UI::Xaml::Controls::TextChangedEventArgs const& e);

    private:
        void LoadGames();
        void LoadItems(std::shared_ptr<gameplanner::Game> game);
        void RefreshBuildOrder();
        void FilterItems(const std::wstring& searchText);

        std::vector<std::shared_ptr<gameplanner::Game>> games_;
        std::shared_ptr<gameplanner::Game> currentGame_;
        std::vector<std::shared_ptr<gameplanner::GameItem>> currentItems_;
        std::vector<std::shared_ptr<gameplanner::GameItem>> filteredItems_;
        std::shared_ptr<gameplanner::BuildOrder> buildOrder_;
    };
}

namespace winrt::GamePlannerApp::factory_implementation
{
    struct MainWindow : MainWindowT<MainWindow, implementation::MainWindow>
    {
    };
}
