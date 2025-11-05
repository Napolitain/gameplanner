#include "pch.h"
#include "MainWindow.xaml.h"
#if __has_include("MainWindow.g.cpp")
#include "MainWindow.g.cpp"
#endif

using namespace winrt;
using namespace Microsoft::UI::Xaml;
using namespace Microsoft::UI::Xaml::Controls;
using namespace gameplanner;

namespace winrt::GamePlannerApp::implementation
{
    MainWindow::MainWindow()
    {
        InitializeComponent();
        buildOrder_ = std::make_shared<BuildOrder>();
        LoadGames();
    }

    void MainWindow::LoadGames()
    {
        games_ = GameFactory::CreateAllGames();
        
        // Create a collection for the ListView
        auto gamesList = winrt::single_threaded_observable_vector<IInspectable>();
        
        for (const auto& game : games_)
        {
            // Create a simple object to bind to XAML
            auto gameItem = winrt::make<winrt::Windows::Foundation::IPropertyValue>();
            // Note: In a real implementation, we would create proper WinRT objects
            // For now, this demonstrates the structure
            gamesList.Append(gameItem);
        }
        
        GamesListView().ItemsSource(gamesList);
        
        // Select the first game by default
        if (!games_.empty())
        {
            GamesListView().SelectedIndex(0);
            currentGame_ = games_[0];
            LoadItems(currentGame_);
        }
    }

    void MainWindow::LoadItems(std::shared_ptr<Game> game)
    {
        if (!game) return;
        
        currentGame_ = game;
        currentItems_ = std::vector<std::shared_ptr<GameItem>>(
            game->GetItems().begin(), 
            game->GetItems().end()
        );
        filteredItems_ = currentItems_;
        
        // Create a collection for the items
        auto itemsList = winrt::single_threaded_observable_vector<IInspectable>();
        
        for (const auto& item : filteredItems_)
        {
            // In a real implementation, wrap GameItem in a WinRT object
            auto wrappedItem = winrt::make<winrt::Windows::Foundation::IPropertyValue>();
            itemsList.Append(wrappedItem);
        }
        
        ItemsRepeater().ItemsSource(itemsList);
    }

    void MainWindow::GamesListView_SelectionChanged(
        IInspectable const& sender,
        SelectionChangedEventArgs const& e)
    {
        auto listView = sender.as<ListView>();
        int selectedIndex = listView.SelectedIndex();
        
        if (selectedIndex >= 0 && selectedIndex < static_cast<int>(games_.size()))
        {
            LoadItems(games_[selectedIndex]);
        }
    }

    void MainWindow::AddItemButton_Click(
        IInspectable const& sender,
        RoutedEventArgs const& e)
    {
        auto button = sender.as<Button>();
        // In a real implementation, get the item from the button's Tag
        // For now, this is a placeholder
        
        // Add a step to the build order
        if (!filteredItems_.empty())
        {
            buildOrder_->AddStep(filteredItems_[0]);
            RefreshBuildOrder();
        }
    }

    void MainWindow::RemoveStepButton_Click(
        IInspectable const& sender,
        RoutedEventArgs const& e)
    {
        auto button = sender.as<Button>();
        // Get the step index from the button's Tag
        // buildOrder_->RemoveStep(index);
        RefreshBuildOrder();
    }

    void MainWindow::ClearButton_Click(
        IInspectable const& sender,
        RoutedEventArgs const& e)
    {
        buildOrder_->Clear();
        RefreshBuildOrder();
    }

    void MainWindow::SearchTextBox_TextChanged(
        IInspectable const& sender,
        TextChangedEventArgs const& e)
    {
        auto textBox = sender.as<TextBox>();
        auto searchText = textBox.Text();
        FilterItems(std::wstring(searchText));
    }

    void MainWindow::RefreshBuildOrder()
    {
        auto panel = BuildOrderPanel();
        panel.Children().Clear();
        
        const auto& steps = buildOrder_->GetSteps();
        
        if (steps.empty())
        {
            EmptyStateText().Visibility(Visibility::Visible);
        }
        else
        {
            EmptyStateText().Visibility(Visibility::Collapsed);
            
            for (size_t i = 0; i < steps.size(); ++i)
            {
                const auto& step = steps[i];
                const auto& item = step->GetItem();
                
                // Create a card for each step
                auto border = Border();
                border.Background(Application::Current().Resources().Lookup(box_value(L"CardBackgroundFillColorDefaultBrush")).as<Media::Brush>());
                border.BorderBrush(Application::Current().Resources().Lookup(box_value(L"CardStrokeColorDefaultBrush")).as<Media::Brush>());
                border.BorderThickness(ThicknessHelper::FromUniformLength(1));
                border.CornerRadius(CornerRadiusHelper::FromUniformRadius(4));
                border.Padding(ThicknessHelper::FromUniformLength(12));
                
                auto grid = Grid();
                auto col1 = ColumnDefinition();
                col1.Width(GridLengthHelper::FromValueAndType(1, GridUnitType::Auto));
                auto col2 = ColumnDefinition();
                col2.Width(GridLengthHelper::FromValueAndType(1, GridUnitType::Star));
                auto col3 = ColumnDefinition();
                col3.Width(GridLengthHelper::FromValueAndType(1, GridUnitType::Auto));
                grid.ColumnDefinitions().Append(col1);
                grid.ColumnDefinitions().Append(col2);
                grid.ColumnDefinitions().Append(col3);
                
                // Step number
                auto stepNumber = TextBlock();
                stepNumber.Text(winrt::to_hstring(step->GetStepNumber()) + L".");
                stepNumber.FontWeight(winrt::Windows::UI::Text::FontWeights::SemiBold());
                stepNumber.FontSize(16);
                stepNumber.Margin(ThicknessHelper::FromLengths(0, 0, 12, 0));
                Grid::SetColumn(stepNumber, 0);
                grid.Children().Append(stepNumber);
                
                // Item info
                auto itemInfo = StackPanel();
                
                auto itemName = TextBlock();
                itemName.Text(winrt::to_hstring(item->GetName()));
                itemName.FontWeight(winrt::Windows::UI::Text::FontWeights::SemiBold());
                itemInfo.Children().Append(itemName);
                
                auto itemCategory = TextBlock();
                itemCategory.Text(winrt::to_hstring(item->GetCategory()));
                itemCategory.FontSize(12);
                itemCategory.Foreground(Application::Current().Resources().Lookup(box_value(L"TextFillColorSecondaryBrush")).as<Media::Brush>());
                itemInfo.Children().Append(itemCategory);
                
                Grid::SetColumn(itemInfo, 1);
                grid.Children().Append(itemInfo);
                
                // Remove button
                auto removeBtn = Button();
                removeBtn.Content(box_value(L"Remove"));
                removeBtn.Click({this, &MainWindow::RemoveStepButton_Click});
                Grid::SetColumn(removeBtn, 2);
                grid.Children().Append(removeBtn);
                
                border.Child(grid);
                panel.Children().Append(border);
            }
        }
    }

    void MainWindow::FilterItems(const std::wstring& searchText)
    {
        if (searchText.empty())
        {
            filteredItems_ = currentItems_;
        }
        else
        {
            filteredItems_.clear();
            std::wstring lowerSearch = searchText;
            std::transform(lowerSearch.begin(), lowerSearch.end(), lowerSearch.begin(), ::towlower);
            
            for (const auto& item : currentItems_)
            {
                std::wstring itemName = winrt::to_hstring(item->GetName()).c_str();
                std::transform(itemName.begin(), itemName.end(), itemName.begin(), ::towlower);
                
                if (itemName.find(lowerSearch) != std::wstring::npos)
                {
                    filteredItems_.push_back(item);
                }
            }
        }
        
        LoadItems(currentGame_);
    }
}
