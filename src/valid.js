export function toValid(value, _invalid) {
  return value ? valid(value) :
    invalid(_invalid);
};

export function valid(value) {
  return new Validation(null, value);
};

export function invalid(invalid) {
  return new Validation(invalid);
};

function Validation(a_invalid, a_valid) {
  this.invalid = a_invalid;
  this.valid = a_valid;

  const makeInvalid = (_invalid) => {
    a_valid = null;
    a_invalid = _invalid;

    this.invalid = a_invalid;
    this.valid = a_valid;
  };

  const makeValid = (_valid) => {
    a_valid = _valid;
    a_invalid = null;

    this.valid = a_valid;
    this.invalid = a_invalid;
  };

  this.flatMap = (fvalid, finvalid = _ => invalid(_)) => {
    return this.valid ? fvalid(this.valid) : 
      finvalid(this.invalid);
  };

  this.fold = (fvalid, finvalid = _ => _) => {
    return this.valid ? fvalid(this.valid) : 
      finvalid(this.invalid);
  };

  this.rawMap = (fvalid) => {
    if (this.valid) {
      makeValid(fvalid(this.valid));
    }
    return this;
  };

  this.map = (fvalid) => {
    return this.copy().rawMap(fvalid);
  };

  this.check = (ftest, _invalid) => {
    if (this.valid && ftest(this.valid)) {
      makeInvalid(_invalid);
    }
    return this;
  };

  this.checkOr = (ftest1, ftest2, _invalid) => {
    if (this.valid && !(ftest1(this.valid)
                        || ftest2(this.valid))) {
      makeInvalid(_invalid);
    }
    return this;
  };

  this.getOrElse = (_) => {
    return this.valid ? this.valid : _();
  };

  this.copy = () => {
    return new Validation(this.invalid, this.valid);
  };

  this.copyMap = (fvalid) => {
    return this.copy().map(fvalid);
  };
}
