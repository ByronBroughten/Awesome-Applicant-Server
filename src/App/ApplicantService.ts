import { pick } from "lodash";
import {
  DataTypes,
  Model,
  ModelAttributeColumnOptions,
  Sequelize,
} from "sequelize";
import { initSequelize } from "./initSequelize";

type ApplicantPropName = "fullName" | "skill" | "hobby";
const applicantPropNames: ApplicantPropName[] = ["fullName", "skill", "hobby"];
export type Applicant = Record<ApplicantPropName, string>;

type ModelAttributes = ModelAttributeColumnOptions<Model<any, any>>;

export const byronProps = {
  fullName: "Byron Broughten",
  skill: "Programming with React and Node.js",
  hobby: "Playing funky bass guitar",
} as const;

export class ApplicantService {
  private sequelize: Sequelize;
  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }
  private get model() {
    const model = this.sequelize.models.Applicant;
    return model;
  }
  async getByron(): Promise<Applicant> {
    return this.get(byronProps.fullName);
  }
  async get(fullName: string): Promise<Applicant> {
    const applicant = await this.findByFullName(fullName);
    if (applicant) {
      return applicant;
    } else {
      throw new Error(`Applicant not found with full name "${fullName}".`);
    }
  }
  async has(fullName: string): Promise<boolean> {
    const applicant = await this.findByFullName(fullName);
    if (applicant) {
      return true;
    } else {
      return false;
    }
  }
  async create(props: Applicant): Promise<Applicant> {
    const model = await this.model.create(props);
    return pick(model.dataValues, applicantPropNames) as Applicant;
  }
  async last(): Promise<Applicant> {
    const model = await this.model.findOne({
      order: [["createdAt", "DESC"]],
      attributes: applicantPropNames,
    });
    if (!model) {
      throw new Error("There are no applicants");
    }
    return model.dataValues as Applicant;
  }
  async update(fullName: string, update: Omit<Applicant, "fullName">) {
    this.model.update(update, {
      where: { fullName },
    });
  }
  async delete(fullName: string, deleteByron?: boolean): Promise<void> {
    if (fullName === byronProps.fullName && !deleteByron) {
      throw new Error("You cannot delete Byron, as he is the true applicant.");
    } else {
      this.model.destroy({ where: { fullName } });
    }
  }
  async init() {
    const sequelizeProps: Record<ApplicantPropName, ModelAttributes> = {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      skill: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hobby: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    };

    const tableName = "Applicant";
    this.sequelize.define(tableName, sequelizeProps);
    await this.sequelize.sync();
  }
  async setDefault(): Promise<void> {
    await this.deleteAll();
    await this.create(byronProps);
  }
  async deleteAll(): Promise<number> {
    return await this.model.destroy({
      truncate: true,
    });
  }
  private async findByFullName(fullName: string): Promise<Applicant | null> {
    const model = await this.model.findOne({
      where: { fullName },
      attributes: applicantPropNames,
    });
    return model?.dataValues as Promise<Applicant | null>;
  }
  static async init() {
    const sequelize = await initSequelize();
    const applicantService = new ApplicantService(sequelize);
    await applicantService.init();
    return applicantService;
  }
}
