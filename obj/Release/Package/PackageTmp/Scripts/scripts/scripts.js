$(function () {
    var esdFaceHub = $.connection.eSDFaceHub;
    var alertQueue = $('.table-wrapper');   // Phần tử chứa thông báo
    var currentData = {}; // Đối tượng lưu trữ trạng thái thông báo hiện tại, dùng mã thẻ làm khóa

    // Hàm ẩn hoặc xóa bảng nếu không còn thông báo
    function checkAndHideTable() {
        if (alertQueue.find('tbody tr').length === 0) {
            alertQueue.hide(); // Ẩn phần tử alertQueue nếu không có dữ liệu
        }
    }

    // Hàm tạo hoặc cập nhật bảng
    function createTableIfNeeded() {
        if (alertQueue.find('table').length === 0) {
            // Tạo bảng mới nếu chưa có
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
        alertQueue.show(); // Hiển thị bảng
    }

    // Hàm cập nhật chiều cao của alertQueue và #alert-body
    function updateContainerHeight() {
        var $footer = $('footer');
        var footerHeight = $footer.outerHeight(true); // Chiều cao của footer
        var containerTop = alertQueue.offset().top; // Vị trí của alertQueue tính từ đầu trang
        var windowHeight = $(window).height(); // Chiều cao của cửa sổ

        // Tính chiều cao của alertQueue để nó không bị đè lên footer
        var availableHeight = windowHeight - (containerTop + footerHeight + 20); // Cộng thêm 20px khoảng trống để cuộn mượt hơn
        alertQueue.css('max-height', availableHeight + 'px');
    }

    // Hàm cập nhật chiều cao của #alert-body
    function updateTbodyHeight() {
        var $thead = alertQueue.find('thead');
        var theadHeight = $thead.outerHeight(true); // Chiều cao của thead

        // Cập nhật chiều cao của #alert-body dựa trên chiều cao của alertQueue
        var tbodyHeight = alertQueue.height() - theadHeight;

        // Cập nhật chiều cao của #alert-body
        alertQueue.find('#alert-body').css('max-height', tbodyHeight + 'px');
    }

    // Hàm cập nhật thông báo dựa trên dữ liệu mới
    function updateAlerts(employeeData) {
        var seenEmployees = new Set(); // Set để theo dõi các mã thẻ đã thấy
        var hasData = false; // Biến để kiểm tra xem có dữ liệu không
        var rows = []; // Mảng để lưu trữ hàng dữ liệu

        // Lặp qua dữ liệu mới để cập nhật thông báo
        $.each(employeeData, function (index, employee) {
            var errorCode = employee.ErrorCode.toLowerCase(); // Chuyển mã lỗi thành chữ thường

            // Nếu trạng thái là pass, xóa thông báo lỗi liên quan
            if (errorCode === 'pass') {
                var $alertItem = currentData[employee.MaThe];
                if ($alertItem) {
                    $alertItem.fadeOut(function () {
                        $alertItem.remove(); // Xóa phần tử thông báo sau khi ẩn
                        delete currentData[employee.MaThe]; // Cập nhật dữ liệu hiện tại
                        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không còn thông báo
                    });
                }
            } else {
                // Nếu trạng thái là fail, kiểm tra và thêm thông báo lỗi mới nếu chưa thấy
                hasData = true; // Đặt cờ có dữ liệu
                var existingAlertItem = currentData[employee.MaThe];
                var employeeTime = moment(employee.ThoiGian).valueOf(); // Chuyển thời gian thành giá trị số để so sánh

                if (existingAlertItem) {
                    // Nếu hàng đã tồn tại và thời gian mới hơn thì cập nhật
                    var existingTime = moment(existingAlertItem.find('td').eq(4).text(), 'YYYY/MM/DD HH:mm:ss').valueOf();
                    if (employeeTime > existingTime) {
                        existingAlertItem.find('td').eq(1).text(employee.HoTen);
                        existingAlertItem.find('td').eq(2).text(employee.TenBoPhan);
                        existingAlertItem.find('td').eq(3).text(employee.Status);
                        existingAlertItem.find('td').eq(4).text(moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss'));
                        existingAlertItem.fadeIn(); // Hiển thị thông báo đã cập nhật
                    }
                } else {
                    // Nếu hàng chưa tồn tại thì thêm vào mảng hàng mới
                    var $newRow = $(`
                        <tr class="table-danger text-white custom-tbody text-bg-danger">
                            <td >${employee.MaThe}</td>
                            <td>${employee.HoTen}</td>
                            <td>${employee.TenBoPhan}</td>
                            <td>${employee.Status}</td>
                            <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
                        </tr>
                    `);
                    rows.push($newRow); // Thêm đối tượng jQuery vào mảng hàng
                    currentData[employee.MaThe] = $newRow; // Lưu trữ đối tượng jQuery trong currentData
                }
            }
        });

        // Thêm tất cả các hàng dữ liệu vào tbody
        if (rows.length > 0) {
            var $tbody = alertQueue.find('#alert-body');
            $tbody.prepend(rows); // Thêm các hàng dữ liệu vào đầu tbody

            // Tăng kích thước của #alert-body nếu có dữ liệu mới
            var newTbodyHeight = $tbody[0].scrollHeight; // Chiều cao thực tế của tbody sau khi thêm hàng
            $tbody.css('max-height', newTbodyHeight + 'px');
        }

        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không có dữ liệu
    }

    // Gọi hàm này khi kích thước cửa sổ thay đổi để cập nhật chiều cao của alertQueue và #alert-body
    $(window).resize(function () {
        updateContainerHeight(); // Cập nhật chiều cao của alertQueue khi kích thước cửa sổ thay đổi
        updateTbodyHeight(); // Cập nhật chiều cao của #alert-body khi kích thước cửa sổ thay đổi
    });

    // Nhận dữ liệu mới từ SignalR Hub
    esdFaceHub.client.updateEmployeeData = function (employeeData) {
        console.log('Received data:', employeeData); // Ghi log dữ liệu nhận được
        createTableIfNeeded(); // Tạo bảng nếu chưa có
        updateAlerts(employeeData); // Cập nhật thông báo với dữ liệu mới
        updateContainerHeight(); // Cập nhật chiều cao của alertQueue sau khi cập nhật thông báo
        updateTbodyHeight(); // Cập nhật chiều cao của #alert-body sau khi cập nhật thông báo
    };

    // Bắt đầu kết nối với SignalR Hub khi trang được tải xong
    $.connection.hub.start().done(function () {
        console.log('SignalR connected.'); // Ghi log khi kết nối thành công

        // Làm mới dữ liệu mỗi 4 giây
        setInterval(function () {
            esdFaceHub.server.getEmployeeData(); // Gọi phương thức của máy chủ để lấy dữ liệu mới
        }, 4000); // 4000ms = 4 giây
    });

    // Cập nhật chiều cao của alertQueue và #alert-body khi trang được tải
    updateContainerHeight();
    updateTbodyHeight();
});
