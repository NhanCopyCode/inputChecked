

function Validator(options) {
    var formElement = document.querySelector(options.form);

    var ruleSelector = {};

    //Hàm lấy ra form-group
    function getParentElement(inputElement, selector) {
        while(inputElement.parentElement) {
            if(inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement;
            }
            inputElement = inputElement.parentElement;
        }
    }
    // Hàm để check việc blur ra ngoài
    function validate(inputElement, rule) {
        var errorElement = getParentElement(inputElement, options.formGroup).querySelector( options.errorSelector);
        var errorMessage ;

        var rules = ruleSelector[rule.selector]
        for(var i = 0; i < rules.length; i++) {
           errorMessage = rules[i](inputElement.value);
           if(errorMessage) break;
        }
        if (errorMessage) {
            getParentElement(inputElement, options.formGroup).classList.add("invalid");
            errorElement.innerText = errorMessage;
        } else {
            getParentElement(inputElement, options.formGroup).classList.remove("invalid");
            errorElement.innerText = "";
        }
    return !errorMessage;
    }

    if (formElement) {

        //Bỏ đi hành động mặc định của nút submit
        formElement.onsubmit = function(e) {
            e.preventDefault();
            
            var isFormValid = true;

            // Còn phần audio và checkBox
            

            
            // Khi nhấn submit mà chưa nhập input gì hết
            // thì phải hiện đỏ tất cả element
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            })
        
            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {
                    // Cách 1
                    // options.onSubmit({
                    //     fullName: formElement.querySelector('#fullName').value,
                    //     email: formElement.querySelector('#email').value,
                    //     password: formElement.querySelector('#password').value,
                    //     password_confirmation: formElement.querySelector('#password-confirmation').value
                    // })

                    // Cách 2
                    var enableInput = formElement.querySelectorAll('[name]')

                    var formValue = Array.from(enableInput).reduce(function(value, input) {
                        value[input.name] = input.value;
                        return value;
                    }, {})
                    options.onSubmit(formValue);
                }
            }

        }

        
        
        // Lặp qua mỗi rule và xử lí
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);

            if(Array.isArray(ruleSelector[rule.selector])) {
                ruleSelector[rule.selector].push(rule.test);
            }else {
                ruleSelector[rule.selector] = [rule.test]
            }
            
            var errorElement = getParentElement(inputElement, options.formGroup).querySelector( options.errorSelector);
           
            // Xử lý sự kiện onblur / khi blur ra khỏi thẻ thì phải thông báo
            inputElement.onblur = function () {
                var isValid = validate(inputElement, rule)
            };
            // Xử lí sự kiện oninput / Xử lí sự kiện người dùng nhập vào input 
            // nhưng vẫn báo lỗi khi chưa blur
            inputElement.oninput = function() {
                getParentElement(inputElement, options.formGroup).classList.remove("invalid");
                errorElement.innerText = "";
            }

            
            
        });
        // console.log(ruleSelector)
        
    }
}

// Định nghĩa nguyên tắc các rules
// Nếu mà không có lỗi => undefined
// Nếu mà có lỗi trả ra => Message lỗi
Validator.isRequired = (value) => ({
    selector: value,
    test: function (value) {
        return value ? undefined : "Vui lòng nhập trường này";
    },
});
Validator.isEmail = (value) => ({
    selector: value,
    test: function (value) {
        var input = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return input.test(value) ? undefined : "Vui lòng nhập đúng email";
    },
});

//  Phải nhập đúng 6 kí tự
Validator.minLength = (value, length) => ({
    selector: value,
    test: function (value) {
        return value.trim().length >= length ? undefined : `Vui lòng nhập mật khẩu nhiều hơn ${length} kí tự`;
    },
});
Validator.confirmated = (value, getPasswordValue, message) => ({
    selector: value,
    test: function (inputElement) {
        return inputElement === getPasswordValue().trim() ? undefined : message || "Vui lòng nhập đúng mật khẩu";
    },
});
