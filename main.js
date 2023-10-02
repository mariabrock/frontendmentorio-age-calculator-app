const validateForm = (formSelector) => {
	return new Promise((resolve, reject) => {

		const formElement = document.querySelector(formSelector);
		let currentDate =  new Date().getFullYear();

		const validationOptions = [
			{
				attribute: 'customDayLength',
				isValid: input =>
					input.value <= 31 &&
					input.value.length >= parseInt(input.maxLength, 10),
				errorMessage: (input, label) =>
					`Must be a valid day.`
			},
			{
				attribute: 'customMonthLength',
				isValid: input =>
					input.value <= 12 &&
					input.value.length >= parseInt(input.maxLength, 10),
				errorMessage: (input, label) =>
					`Must be a valid month.`
			},
			{
				attribute: 'customYearLength',
				isValid: input =>
					input.value <= currentDate &&
					input.value >= 1900,
				errorMessage: (input, label) =>
					`Must be a valid year.`
			},
			{
				attribute: 'required',
				isValid: input => input.value.trim() !== '',
				errorMessage: (input, label) => `${ label.textContent } is required.`

			},
		];

		const validateSingleFormGroup = formGroup => {
			const label = formGroup.querySelector('label');
			const input = formGroup.querySelector('input');
			const errorContainer = formGroup.querySelector('.error');

			let formGroupError = false;
			for(const option of validationOptions) {
				if(input.hasAttribute(option.attribute) && !option.isValid(input)) {
					errorContainer.textContent = option.errorMessage(input, label);
					input.classList.add('error-input');
					formGroupError = true;
				}
			}
			if(!formGroupError) {
				errorContainer.textContent = '';
				input.classList.remove('error-input');
			}
			return !formGroupError;
		};

		formElement.setAttribute('novalidate', '');

		const validateAllFormGroups = formToValidate => {
			const formGroups = Array.from(formToValidate.querySelectorAll('.form-group'));
			return formGroups.every(formGroup => validateSingleFormGroup(formGroup));
		};

		Array.from(formElement.elements).forEach(element =>
			element.addEventListener('blur', event => {
				validateSingleFormGroup(event.target.parentElement);
			})
		);

		formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			console.log('test');
			const formValid = validateAllFormGroups(formElement);

			if(!formValid) {
				event.preventDefault();
			} else {
				console.log('Form is valid');
				resolve(formElement);
			}
		});
	});
};

const sendToAPI = formElement => {
	const formObject = Array.from(formElement.elements)
		.filter(element => element.type !== 'submit')
		.reduce((accumulator, element) => ({
			...accumulator, [element.id]: element.value
		}), {});
	console.log(formObject)

}

validateForm('#ageForm')
	.then(formElement => {
		console.log('Promise resolved');
		sendToAPI(formElement);
	})
