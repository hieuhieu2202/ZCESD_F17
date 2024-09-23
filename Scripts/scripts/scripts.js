//$(function () {
//    var esdFaceHub = $.connection.eSDFaceHub;
//    var alertQueue = $('.table-wrapper');   // Phần tử chứa thông báo
//    var currentData = {}; // Đối tượng lưu trữ trạng thái thông báo hiện tại, dùng mã thẻ làm khóa

//    // Hàm ẩn hoặc xóa bảng nếu không còn thông báo
//    function checkAndHideTable() {
//        if (alertQueue.find('tbody tr').length === 0) {
//            alertQueue.hide(); // Ẩn phần tử alertQueue nếu không có dữ liệu
//        }
//    }

//    // Hàm tạo hoặc cập nhật bảng
//    function createTableIfNeeded() {
//        if (alertQueue.find('table').length === 0) {
//            // Tạo bảng mới nếu chưa có
//            alertQueue.append(`
//                <table class="table table-bordered table-hover table-striped text-center custom-table">
//                    <thead class="text-yellow">
//                        <tr>
//                            <th>Mã thẻ<br />卡码</th>
//                            <th>Họ tên<br />姓名</th>
//                            <th>Bộ phận<br />部分</th>
//                            <th>Trạng thái<br />地位</th>
//                            <th>Thời gian<br />时间</th>
//                        </tr>
//                    </thead>
//                    <tbody id="alert-body"></tbody>
//                </table>
//            `);
//        }
//        alertQueue.show(); // Hiển thị bảng
//    }

//    // Hàm cập nhật chiều cao của alertQueue và #alert-body
//    function updateContainerHeight() {
//        var $footer = $('footer');
//        var footerHeight = $footer.outerHeight(true); // Chiều cao của footer
//        var containerTop = alertQueue.offset().top; // Vị trí của alertQueue tính từ đầu trang
//        var windowHeight = $(window).height(); // Chiều cao của cửa sổ

//        // Tính chiều cao của alertQueue để nó không bị đè lên footer
//        var availableHeight = windowHeight - (containerTop + footerHeight + 20); // Cộng thêm 20px khoảng trống để cuộn mượt hơn
//        alertQueue.css('max-height', availableHeight + 'px');
//    }

//    // Hàm cập nhật chiều cao của #alert-body
//    function updateTbodyHeight() {
//        var $thead = alertQueue.find('thead');
//        var theadHeight = $thead.outerHeight(true); // Chiều cao của thead

//        // Cập nhật chiều cao của #alert-body dựa trên chiều cao của alertQueue
//        var tbodyHeight = alertQueue.height() - theadHeight;

//        // Cập nhật chiều cao của #alert-body
//        alertQueue.find('#alert-body').css('max-height', tbodyHeight + 'px');
//    }

//    // Hàm cập nhật thông báo dựa trên dữ liệu mới
//    function updateAlerts(employeeData) {
//        var seenEmployees = new Set(); // Set để theo dõi các mã thẻ đã thấy
//        var hasData = false; // Biến để kiểm tra xem có dữ liệu không
//        var rows = []; // Mảng để lưu trữ hàng dữ liệu
//        var updatedRows = {}; // Đối tượng để lưu trữ các hàng đã cập nhật
//        var $tbody = alertQueue.find('#alert-body'); // Truy vấn tbody một lần

//        // Lặp qua dữ liệu mới để cập nhật thông báo
//        $.each(employeeData, function (index, employee) {
//            var errorCode = employee.ErrorCode.toLowerCase(); // Chuyển mã lỗi thành chữ thường
//            var employeeTime = moment(employee.ThoiGian).valueOf(); // Chuyển thời gian thành giá trị số để so sánh

//            // Nếu trạng thái là pass, xóa thông báo lỗi liên quan
//            if (errorCode === 'pass') {
//                var $alertItem = currentData[employee.MaThe];
//                if ($alertItem) {
//                    $alertItem.fadeOut(function () {
//                        $alertItem.remove(); // Xóa phần tử thông báo sau khi ẩn
//                        delete currentData[employee.MaThe]; // Cập nhật dữ liệu hiện tại
//                        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không còn thông báo
//                    });
//                }
//            } else {
//                // Nếu trạng thái là fail, kiểm tra và thêm thông báo lỗi mới nếu chưa thấy
//                hasData = true; // Đặt cờ có dữ liệu
//                var existingAlertItem = currentData[employee.MaThe];
//                if (existingAlertItem) {
//                    // Nếu hàng đã tồn tại và thời gian mới hơn thì cập nhật
//                    var existingTime = moment(existingAlertItem.find('td').eq(4).text(), 'YYYY/MM/DD HH:mm:ss').valueOf();
//                    if (employeeTime > existingTime) {
//                        existingAlertItem.find('td').eq(1).text(employee.HoTen);
//                        existingAlertItem.find('td').eq(2).text(employee.TenBoPhan);
//                        existingAlertItem.find('td').eq(3).text(employee.Status);
//                        existingAlertItem.find('td').eq(4).text(moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss'));
//                        updatedRows[employee.MaThe] = existingAlertItem; // Lưu hàng đã cập nhật
//                    }
//                } else {
//                    // Nếu hàng chưa tồn tại thì thêm vào mảng hàng mới
//                    var $newRow = $(
//                        `<tr class="table-danger text-white custom-tbody text-bg-danger">
//                        <td>${employee.MaThe}</td>
//                        <td>${employee.HoTen}</td>
//                        <td>${employee.TenBoPhan}</td>
//                        <td>${employee.Status}</td>
//                        <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
//                    </tr>`
//                    );
//                    rows.push($newRow); // Thêm đối tượng jQuery vào mảng hàng
//                    currentData[employee.MaThe] = $newRow; // Lưu trữ đối tượng jQuery trong currentData
//                }
//            }
//        });

//        // Thêm tất cả các hàng dữ liệu mới vào tbody một lần để tránh cập nhật DOM quá nhiều lần
//        if (rows.length > 0) {
//            $tbody.prepend(rows); // Thêm các hàng dữ liệu mới vào đầu tbody
//        }

//        // Kiểm tra và cập nhật các hàng đã thay đổi
//        $.each(updatedRows, function (key, row) {
//            row.fadeIn(); // Hiển thị các hàng đã được cập nhật
//        });

//        // Tăng kích thước của #alert-body nếu có dữ liệu mới
//        if (rows.length > 0) {
//            var newTbodyHeight = $tbody[0].scrollHeight; // Chiều cao thực tế của tbody sau khi thêm hàng
//            $tbody.css('max-height', newTbodyHeight + 'px');
//        }

//        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không có dữ liệu
//    }


//    // Gọi hàm này khi kích thước cửa sổ thay đổi để cập nhật chiều cao của alertQueue và #alert-body
//    $(window).resize(function () {
//        updateContainerHeight(); // Cập nhật chiều cao của alertQueue khi kích thước cửa sổ thay đổi
//        updateTbodyHeight(); // Cập nhật chiều cao của #alert-body khi kích thước cửa sổ thay đổi
//    });

//    // Nhận dữ liệu mới từ SignalR Hub
//    esdFaceHub.client.updateEmployeeData = function (employeeData) {
//        console.log('Received data:', employeeData); // Ghi log dữ liệu nhận được
//        createTableIfNeeded(); // Tạo bảng nếu chưa có
//        updateAlerts(employeeData); // Cập nhật thông báo với dữ liệu mới
//        updateContainerHeight(); // Cập nhật chiều cao của alertQueue sau khi cập nhật thông báo
//        updateTbodyHeight(); // Cập nhật chiều cao của #alert-body sau khi cập nhật thông báo
//    };

//    // Bắt đầu kết nối với SignalR Hub khi trang được tải xong
//    $.connection.hub.start().done(function () {
//        console.log('SignalR connected.'); // Ghi log khi kết nối thành công

//        // Làm mới dữ liệu mỗi 4 giây
//        setInterval(function () {
//            esdFaceHub.server.getEmployeeData(); // Gọi phương thức của máy chủ để lấy dữ liệu mới
//        }, 4000); // 4000ms = 4 giây
//    });

//    // Cập nhật chiều cao của alertQueue và #alert-body khi trang được tải
//    updateContainerHeight();
//    updateTbodyHeight();
//});
//$(function () {
//    var esdFaceHub = $.connection.eSDFaceHub;
//    var alertQueue = $('.table-wrapper'); // Element that holds the alerts
//    var currentData = {}; // Object to store current alert data keyed by card code

//    // Function to filter based on selected doors
//    var urlParams = new URLSearchParams(window.location.search);
//    var equNoFromUrl = urlParams.get('Equno');

//    // Cập nhật giá trị dropdown và lấy dữ liệu nếu có Equno từ URL
//    if (equNoFromUrl) {
//        $('#equNo').val(equNoFromUrl); // Cập nhật dropdown với giá trị từ URL
//        fetchData(); // Gọi hàm fetchData để lấy dữ liệu cho cửa đã chọn
//    }

//    function fetchData() {
//        var equNo = $('#equNo').val();
//        esdFaceHub.server.getEmployeeData(equNo);
//    }

//    // Lắng nghe sự kiện thay đổi trên <select> bằng jQuery
//    $('#equNo').change(fetchData);
//    function getSelectedDoors() {
//        return $('#equNo').val() || []; // Get selected door values, or return an empty array if none selected
//    }

//    // Function to check and hide the table if no alerts are present
//    function checkAndHideTable() {
//        if (alertQueue.find('tbody tr').length === 0) {
//            alertQueue.hide(); // Hide alertQueue if there's no data
//        }
//    }

//    // Function to create the table if needed
//    function createTableIfNeeded() {
//        if (alertQueue.find('table').length === 0) {
//            alertQueue.append(`
//                <table class="table table-bordered table-hover table-striped text-center custom-table">
//                    <thead class="text-yellow">
//                        <tr>
//                            <th>Mã thẻ<br />卡码</th>
//                            <th>Họ tên<br />姓名</th>
//                            <th>Bộ phận<br />部分</th>
//                            <th>Trạng thái<br />地位</th>
//                            <th>Thời gian<br />时间</th>
//                        </tr>
//                    </thead>
//                    <tbody id="alert-body"></tbody>
//                </table>
//            `);
//        }
//        alertQueue.show(); // Show the table
//    }
//    // Hàm cập nhật chiều cao của alertQueue và #alert-body
//        function updateContainerHeight() {
//            var $footer = $('footer');
//            var footerHeight = $footer.outerHeight(true); // Chiều cao của footer
//            var containerTop = alertQueue.offset().top; // Vị trí của alertQueue tính từ đầu trang
//            var windowHeight = $(window).height(); // Chiều cao của cửa sổ

//            // Tính chiều cao của alertQueue để nó không bị đè lên footer
//            var availableHeight = windowHeight - (containerTop + footerHeight + 20); // Cộng thêm 20px khoảng trống để cuộn mượt hơn
//            alertQueue.css('max-height', availableHeight + 'px');
//        }

//        // Hàm cập nhật chiều cao của #alert-body
//        function updateTbodyHeight() {
//            var $thead = alertQueue.find('thead');
//            var theadHeight = $thead.outerHeight(true); // Chiều cao của thead

//            // Cập nhật chiều cao của #alert-body dựa trên chiều cao của alertQueue
//            var tbodyHeight = alertQueue.height() - theadHeight;

//            // Cập nhật chiều cao của #alert-body
//            alertQueue.find('#alert-body').css('max-height', tbodyHeight + 'px');
//        }

//    // Function to update the alerts based on new data
//    function updateAlerts(employeeData) {
//        var seenEmployees = new Set();
//        var hasData = false;
//        var rows = [];
//        var updatedRows = {};
//        var $tbody = alertQueue.find('#alert-body');
//        var selectedDoors = getSelectedDoors(); // Get the selected doors
//        currentData = {};

//        $.each(employeeData, function (index, employee) {
//            var errorCode = employee.ErrorCode.toLowerCase();
//            var employeeTime = moment(employee.ThoiGian).valueOf();

//            // Check if the employee's door is in the selected doors
//            if (selectedDoors.length > 0 && !selectedDoors.includes(employee.Door)) {
//                if (errorCode === 'pass') {
//                    var $alertItem = currentData[employee.MaThe];
//                    if ($alertItem) {
//                        $alertItem.fadeOut(function () {
//                            $alertItem.remove();
//                            delete currentData[employee.MaThe];
//                            checkAndHideTable();
//                        });
//                    }
//                } else {
//                    hasData = true;
//                    var existingAlertItem = currentData[employee.MaThe];
//                    if (existingAlertItem) {
//                        var existingTime = moment(existingAlertItem.find('td').eq(5).text(), 'YYYY/MM/DD HH:mm:ss').valueOf();
//                        if (employeeTime > existingTime) {
//                            existingAlertItem.find('td').eq(1).text(employee.HoTen);
//                            existingAlertItem.find('td').eq(2).text(employee.TenBoPhan);
//                            existingAlertItem.find('td').eq(4).text(employee.Status);
//                            existingAlertItem.find('td').eq(5).text(moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss'));
//                            updatedRows[employee.MaThe] = existingAlertItem;
//                        }
//                    } else {
//                        var $newRow = $(`
//                        <tr class="table-danger text-white custom-tbody text-bg-danger">
//                            <td>${employee.MaThe}</td>
//                            <td>${employee.HoTen}</td>
//                            <td>${employee.TenBoPhan}</td>       
//                            <td>${employee.Status}</td>
//                            <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
//                        </tr>
//                    `);
//                        rows.push($newRow);
//                        currentData[employee.MaThe] = $newRow;
//                    }
//            }

          
            
//            }
//        });

//        if (rows.length > 0) {
//            $tbody.prepend(rows); // Prepend new rows
//        }

//        $.each(updatedRows, function (key, row) {
//            row.fadeIn(); // Fade in updated rows
//        });

//        checkAndHideTable(); // Check and hide table if no data
//    }

//    // Update container and tbody height on window resize
//    $(window).resize(function () {
//        updateContainerHeight();
//        updateTbodyHeight();
//    });

//    // SignalR client-side method to receive data
//    esdFaceHub.client.updateEmployeeData = function (employeeData) {
//        console.log('Received data:', employeeData);
//        createTableIfNeeded();
//        updateAlerts(employeeData);
//        updateContainerHeight();
//        updateTbodyHeight();
//    };

//    // Connect to SignalR Hub and fetch data every 4 seconds
//    $.connection.hub.start().done(function () {
//        console.log('SignalR connected.');
//        fetchData(); // Lần đầu tiên lấy dữ liệu ngay khi kết nối
//        setInterval(function () {
//            fetchData(); // Gọi hàm fetchData mỗi 4 giây
//        }, 4000); // Every 4 seconds
//    });

//    // Fetch data based on selected doors
//    window.fetchData = function () {
//        var equNo = getSelectedDoors(); // Lấy danh sách cổng đã chọn
//        if (equNo.length > 0) {
//            esdFaceHub.server.getEmployeeData(equNo); // Fetch new employee data
//        }
//    };

//    // Update container height on page load
//    updateContainerHeight();
//    updateTbodyHeight();
//});
$(function () {
    var esdFaceHub = $.connection.eSDFaceHub;
    var alertQueue = $('.table-wrapper'); // Element that holds the alerts
    var currentData = {}; // Object to store current alert data keyed by card code

    // Hàm cập nhật dropdown từ URL
    function updateDropdownFromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        var equNoFromUrl = urlParams.get('Equno');

        // Cập nhật giá trị dropdown và lấy dữ liệu nếu có Equno từ URL
        if (equNoFromUrl) {
            $('#equNo').val(equNoFromUrl); // Cập nhật dropdown với giá trị từ URL
            fetchData(); // Gọi hàm fetchData để lấy dữ liệu cho cửa đã chọn
        }
    }

    // Hàm fetchData
    function fetchData() {
        var equNo = $('#equNo').val();
        if (esdFaceHub.connection.state === $.signalR.connectionState.connected) { // Kiểm tra trạng thái kết nối
            if (equNo) {
                esdFaceHub.server.getEmployeeData(equNo);
            }
        } else {
            console.log('SignalR connection not established.');
        }
    }

    // Lắng nghe sự kiện thay đổi trên <select>
    $('#equNo').change(function () {
        var equNo = $(this).val();
        var url = new URL(window.location);
        url.searchParams.set('Equno', equNo); // Cập nhật tham số Equno trong URL
        history.replaceState(null, '', url); // Thay đổi URL mà không làm mới trang
        fetchData(); // Gọi hàm fetchData
    });

    // Hàm kiểm tra và ẩn bảng nếu không có cảnh báo
    function checkAndHideTable() {
        if (alertQueue.find('tbody tr').length === 0) {
            alertQueue.hide(); // Hide alertQueue if there's no data
        }
    }

    // Hàm tạo bảng nếu cần
    function createTableIfNeeded() {
        if (alertQueue.find('table').length === 0) {
            alertQueue.append(`
                <table class="table table-bordered table-hover table-striped text-center custom-table">
                    <thead class="text-yellow">
                        <tr>
                            <th>Mã thẻ<br />卡码</th>
                            <th>Họ tên<br />姓名</th>
                            <th>Bộ phận<br />部分</th>
                            <th>Trạng thái<br />地位</th>
                            <th>Thời gian<br />时间</th>
                        </tr>
                    </thead>
                    <tbody id="alert-body"></tbody>
                </table>
            `);
        }
        alertQueue.show(); // Show the table
    }

    // Hàm cập nhật chiều cao của alertQueue
    function updateContainerHeight() {
        var $footer = $('footer');
        var footerHeight = $footer.outerHeight(true); // Chiều cao của footer
        var containerTop = alertQueue.offset().top; // Vị trí của alertQueue tính từ đầu trang
        var windowHeight = $(window).height(); // Chiều cao của cửa sổ
        var availableHeight = windowHeight - (containerTop + footerHeight + 20); // Cộng thêm 20px khoảng trống
        alertQueue.css('max-height', availableHeight + 'px');
    }

    // Hàm cập nhật chiều cao của #alert-body
    function updateTbodyHeight() {
        var $thead = alertQueue.find('thead');
        var theadHeight = $thead.outerHeight(true);
        var tbodyHeight = alertQueue.height() - theadHeight;
        alertQueue.find('#alert-body').css('max-height', tbodyHeight + 'px');
    }

    // Hàm cập nhật cảnh báo dựa trên dữ liệu mới
    function updateAlerts(employeeData) {
        var seenEmployees = new Set();
        var hasData = false;
        var rows = [];
        var updatedRows = {};
        var $tbody = alertQueue.find('#alert-body');
        currentData = {};

        $.each(employeeData, function (index, employee) {
            var errorCode = employee.ErrorCode.toLowerCase();
            var employeeTime = moment(employee.ThoiGian).valueOf();

            // Kiểm tra xem cửa của nhân viên có trong danh sách đã chọn không
            if (errorCode !== 'pass') {
                hasData = true;
                var $newRow = $(`<tr class="table-danger text-white custom-tbody text-bg-danger">
                                    <td>${employee.MaThe}</td>
                                    <td>${employee.HoTen}</td>
                                    <td>${employee.TenBoPhan}</td>
                                    <td>${employee.Status}</td>
                                    <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
                                </tr>`);
                rows.push($newRow);
                currentData[employee.MaThe] = $newRow;
            }
        });

        if (rows.length > 0) {
            $tbody.prepend(rows); // Prepend new rows
        }

        checkAndHideTable(); // Check and hide table if no data
    }

    // Cập nhật chiều cao khi resize
    $(window).resize(function () {
        updateContainerHeight();
        updateTbodyHeight();
    });

    // Nhận dữ liệu từ SignalR
    esdFaceHub.client.updateEmployeeData = function (employeeData) {
        console.log('Received data:', employeeData);
        createTableIfNeeded();
        updateAlerts(employeeData);
        updateContainerHeight();
        updateTbodyHeight();
    };

    // Kết nối đến SignalR Hub
    $.connection.hub.start().done(function () {
        console.log('SignalR connected.');
        updateDropdownFromUrl(); // Cập nhật dropdown từ URL khi kết nối
        fetchData(); // Lần đầu tiên lấy dữ liệu ngay khi kết nối
        setInterval(fetchData, 4000); // Gọi hàm fetchData mỗi 4 giây
    }).fail(function () {
        console.error('SignalR connection failed.');
    });

    // Cập nhật chiều cao của container khi tải trang
    updateContainerHeight();
    updateTbodyHeight();
});


